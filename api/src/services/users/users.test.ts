import type { User } from '@prisma/client'

import { EmailValidationError } from '@redwoodjs/api'

import { ROLES } from 'src/lib/constants'

import {
  users,
  user,
  createUser,
  updateUser,
  deleteUser,
  currentUserIsUSDRAdmin,
  usersByOrganization,
  runGeneralCreateOrUpdateValidations,
  runPermissionsCreateOrUpdateValidations,
  runUpdateSpecificValidations,
  getOrCreateUsers,
} from './users'
import type { StandardScenario } from './users.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

const mockPassageUser = {
  create: jest.fn(),
  activate: jest.fn(),
  delete: jest.fn(),
}

jest.mock('@passageidentity/passage-node', () => {
  return jest.fn().mockImplementation(() => ({ user: mockPassageUser }))
})

describe('user queries', () => {
  scenario('gets or creates a user', async (scenario: StandardScenario) => {
    const result = await getOrCreateUsers(
      [
        {
          email: 'uniqueemail1@test.com',
          name: 'String',
          role: 'ORGANIZATION_ADMIN',
          agencyName: scenario.agency.one.name,
        },
        {
          email: 'newuser99@example.com',
          name: 'String',
          role: 'ORGANIZATION_STAFF',
          agencyName: scenario.agency.two.name,
        },
      ],
      scenario.organization.one.name
    )
    expect(result.length).toEqual(2)
    expect(result[0].id).toEqual(scenario.user.one.id)
    expect(result[1].email).toEqual('newuser99@example.com')
  })
  scenario(
    'users query returns all users for USDR admin',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.user.one.id,
        email: scenario.user.one.email,
        roles: ['USDR_ADMIN'],
      })
      const result = await users()

      expect(result.length).toEqual(Object.keys(scenario.user).length)
    }
  )

  scenario(
    'users query returns only users in organization for non-USDR admin',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.user.two.id,
        email: scenario.user.two.email,
        roles: ['ORGANIZATION_STAFF'],
        agency: scenario.agency.one,
      })
      const result = await users()

      expect(result.length).toEqual(2)
    }
  )

  scenario(
    'returns a single user, USDR admin',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.user.one.id,
        email: scenario.user.one.email,
        roles: ['USDR_ADMIN'],
      })
      const result = await user({ id: scenario.user.one.id })

      expect(result).toEqual(scenario.user.one)
    }
  )

  scenario(
    'returns a single user, staff member in same organization',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.user.two.id,
        email: scenario.user.two.email,
        roles: ['ORGANIZATION_STAFF'],
        agency: scenario.agency.one,
      })

      const result = await user({ id: scenario.user.three.id })
      //Not doing toEqual here because user doesn't eagerly fetch agency, so the objects differ slightly
      expect(result?.id).toBeTruthy()
    }
  )

  scenario(
    'does not find user, staff member in different organization',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.user.two.id,
        email: scenario.user.two.email,
        roles: ['ORGANIZATION_STAFF'],
        agency: scenario.agency.one,
      })

      const result = await user({ id: scenario.user.one.id })
      expect(result).toBeNull()
    }
  )

  scenario(
    'users by organization, usdr admin',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.user.one.id,
        email: scenario.user.one.email,
        roles: ['USDR_ADMIN'],
      })
      const result = await usersByOrganization({
        organizationId: scenario.organization.one.id,
      })

      expect(result.length).toBe(2)
    }
  )

  scenario(
    'users by organization, staff in same organization',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.user.two.id,
        email: scenario.user.two.email,
        roles: ['ORGANIZATION_STAFF'],
        agency: scenario.agency.one,
      })
      const result = await usersByOrganization({
        organizationId: scenario.organization.one.id,
      })

      expect(result.length).toBe(2)
    }
  )

  scenario(
    'users by organization, staff in different organization',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.user.one.id,
        email: scenario.user.one.email,
        roles: ['USDR_ORGANIZATION_STAFF'],
        agency: {},
      })
      const result = await usersByOrganization({
        organizationId: scenario.organization.one.id,
      })

      expect(result.length).toBe(0)
    }
  )
})

describe('user writes', () => {
  let oldAuthProvider = process.env.AUTH_PROVIDER

  afterEach(() => {
    process.env.AUTH_PROVIDER = oldAuthProvider
    Object.values(mockPassageUser).forEach((mock) => mock.mockReset());
  })

  scenario('creates a user <local auth>', async (scenario: StandardScenario) => {
    mockCurrentUser({
      id: scenario.user.one.id,
      email: scenario.user.one.email,
      roles: ['USDR_ADMIN'],
    })

    const result = await createUser({
      input: {
        email: 'uniqueemail2@test.com',
        name: 'String',
        agencyId: scenario.agency.one.id,
        role: 'USDR_ADMIN',
      },
    })

    expect(result.email).toEqual('uniqueemail2@test.com')
  })

  scenario('creates a user <passage auth>', async (scenario: StandardScenario) => {
    process.env.AUTH_PROVIDER = 'passage';

    const passageUser = { id: 'new-id-1' };
    mockPassageUser.create.mockReturnValue(passageUser)
    mockPassageUser.activate.mockReturnValue(passageUser);

    mockCurrentUser({
      id: scenario.user.one.id,
      email: scenario.user.one.email,
      roles: ['USDR_ADMIN'],
    })

    const result = await createUser({
      input: {
        email: 'uniqueemail2@test.com',
        name: 'String',
        agencyId: scenario.agency.one.id,
        role: 'USDR_ADMIN',
      },
    })

    expect(result.passageId).toEqual('new-id-1');
  })

  scenario('updates a user <local auth>', async (scenario: StandardScenario) => {
    mockCurrentUser({
      id: scenario.user.one.id,
      email: scenario.user.one.email,
      roles: ['USDR_ADMIN'],
    })
    const email = 'String2@gmail.com'
    const name = 'FDR'
    const role = 'ORGANIZATION_STAFF'
    const isActive = false
    const original = (await user({ id: scenario.user.one.id })) as User
    const result = await updateUser({
      id: original.id,
      input: { email, name, role, agencyId: scenario.agency.one.id, isActive },
    })

    expect(result.email).toEqual(email)
    expect(result.name).toEqual(name)
    expect(result.role).toEqual(ROLES.ORGANIZATION_STAFF)
    expect(result.agencyId).toEqual(scenario.agency.one.id)
    expect(result.isActive).toEqual(false);
  })

  scenario('updates a user <passage auth> - deactivate', async (scenario: StandardScenario) => {
    process.env.AUTH_PROVIDER = 'passage';

    mockCurrentUser({
      id: scenario.user.one.id,
      email: scenario.user.one.email,
      roles: ['USDR_ADMIN'],
    })
    const email = 'String2@gmail.com'
    const name = 'FDR'
    const role = 'ORGANIZATION_STAFF'
    const isActive = false
    const original = (await user({ id: scenario.user.one.id })) as User
    const result = await updateUser({
      id: original.id,
      input: { email, name, role, agencyId: scenario.agency.one.id, isActive },
    })

    expect(result.isActive).toEqual(false);
    expect(result.passageId).toEqual(null);
    expect(mockPassageUser.delete).toHaveBeenCalledWith(original.passageId);
  })

  scenario('updates a user <passage auth> - activate', async (scenario: StandardScenario) => {
    process.env.AUTH_PROVIDER = 'passage';

    const passageUser = { id: 'new-id-1' };
    mockPassageUser.create.mockReturnValue(passageUser)
    mockPassageUser.activate.mockReturnValue(passageUser);

    mockCurrentUser({
      id: scenario.user.one.id,
      email: scenario.user.one.email,
      roles: ['USDR_ADMIN'],
    })
    const original = (await user({ id: scenario.user.inactive.id })) as User
    const result = await updateUser({
      id: original.id,
      input: {
        email: original.email,
        name: original.name,
        role: original.role,
        agencyId: original.agencyId,
        isActive: true
      },
    })

    expect(result.isActive).toEqual(true);
    expect(result.passageId).toEqual('new-id-1');
    expect(mockPassageUser.create).toHaveBeenCalledWith({ email: original.email });
  })

  scenario('deletes a user <local auth>', async (scenario: StandardScenario) => {
    mockCurrentUser({
      id: scenario.user.one.id,
      email: scenario.user.one.email,
      roles: ['USDR_ADMIN'],
    })
    const original = (await deleteUser({
      id: scenario.user.one.id,
    })) as User
    const result = await user({ id: original.id })

    expect(result).toEqual(null)
    expect(mockPassageUser.delete).not.toHaveBeenCalled();
  })

  scenario('deletes a user <passage auth>', async (scenario: StandardScenario) => {
    process.env.AUTH_PROVIDER = 'passage';

    mockCurrentUser({
      id: scenario.user.one.id,
      email: scenario.user.one.email,
      roles: ['USDR_ADMIN'],
    })
    const original = (await deleteUser({
      id: scenario.user.one.id,
    })) as User

    expect(mockPassageUser.delete).toHaveBeenCalledWith(original.passageId);
  })
})

describe('general write validations', () => {
  scenario('general validations, fails on invalid email', async () => {
    expect(
      async () =>
        await runGeneralCreateOrUpdateValidations({
          email: 'iamnotarealemail',
        })
    ).rejects.toThrow(EmailValidationError)
  })

  scenario('general validations, fails on missing name', async () => {
    expect(
      async () =>
        await runGeneralCreateOrUpdateValidations({
          email: 'iamreal@gmail.com',
        })
    ).rejects.toThrow('Please provide a name')
  })

  scenario('general validations, fails on missing role', async () => {
    expect(
      async () =>
        await runGeneralCreateOrUpdateValidations({
          email: 'iamreal@gmail.com',
          name: 'FDR',
        })
    ).rejects.toThrow('Please provide a role')
  })

  scenario(
    'permissions validations, USDR admin should throw no exceptions',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.user.one.id,
        email: scenario.user.one.email,
        roles: ['USDR_ADMIN'],
      })
      expect(
        async () => await runPermissionsCreateOrUpdateValidations({})
      ).not.toThrowError()
    }
  )

  scenario(
    'permissions validations, user w/o admin privileges should throw auth error',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.user.one.id,
        email: scenario.user.one.email,
        roles: ['ORGANIZATION_STAFF'],
      })
      expect(
        async () => await runPermissionsCreateOrUpdateValidations({})
      ).rejects.toThrow("You don't have permission to do that")
    }
  )

  scenario('general validations, fails on bad role', async () => {
    expect(
      async () =>
        await runGeneralCreateOrUpdateValidations({
          email: 'iamreal@gmail.com',
          name: 'FDR',
          role: 'FAKE_ROLE',
        })
    ).rejects.toThrow('Please select a recognized role')
  })

  scenario('general validations, fails on bad agency id', async () => {
    expect(
      async () =>
        await runGeneralCreateOrUpdateValidations({
          email: 'iamreal@gmail.com',
          name: 'FDR',
          role: 'ORGANIZATION_STAFF',
          agencyId: 4598,
        })
    ).rejects.toThrowError('No Agency found')
  })
})

describe('permissions write validations', () => {
  scenario(
    'permissions validations, organization admin cannot update a USDR admin',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.user.one.id,
        email: scenario.user.one.email,
        roles: ['ORGANIZATION_ADMIN'],
      })
      expect(
        async () =>
          await runPermissionsCreateOrUpdateValidations({
            role: ROLES.USDR_ADMIN,
          })
      ).rejects.toThrow("You don't have permission to update that role")
    }
  )

  scenario(
    'permissions validations, organization admin cannot update a user in a different organization',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.user.one.id,
        email: scenario.user.one.email,
        roles: ['ORGANIZATION_ADMIN'],
        agency: scenario.agency.one,
      })
      expect(
        async () =>
          await runPermissionsCreateOrUpdateValidations({
            role: ROLES.ORGANIZATION_STAFF,
            agencyId: scenario.agency.three.id,
          })
      ).rejects.toThrow("You don't have permission to do that")
    }
  )

  scenario(
    'permissions validations, passes when expected',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.user.two.id,
        email: scenario.user.two.email,
        roles: ['ORGANIZATION_ADMIN'],
      })
      expect(
        async () =>
          await runPermissionsCreateOrUpdateValidations({
            role: ROLES.ORGANIZATION_STAFF,
            agencyId: scenario.agency.one.id,
          })
      ).rejects.toThrow("You don't have permission to do that")
    }
  )
})

describe('update specific validations', () => {
  scenario(
    'update specific validations, passes when USDR admin',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.user.two.id,
        email: scenario.user.two.email,
        roles: ['USDR_ADMIN'],
      })
      await expect(
        async () =>
          await runUpdateSpecificValidations(
            {
              role: ROLES.ORGANIZATION_STAFF,
              agencyId: scenario.agency.one.id,
            },
            scenario.user.one.id
          )
      ).not.toThrowError()
    }
  )

  scenario(
    'update specific validations, passes when agency is the same',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.user.two.id,
        email: scenario.user.two.email,
        roles: ['ORGANIZATION_ADMIN'],
      })
      await expect(
        async () =>
          await runUpdateSpecificValidations(
            {
              role: ROLES.ORGANIZATION_STAFF,
              agencyId: scenario.agency.one.id,
            },
            scenario.user.three.id
          )
      ).not.toThrowError()
    }
  )

  scenario(
    'update specific validations, fails when agency is the different',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.user.two.id,
        email: scenario.user.two.email,
        roles: ['ORGANIZATION_ADMIN'],
      })
      await expect(
        async () =>
          await runUpdateSpecificValidations(
            {
              role: ROLES.ORGANIZATION_STAFF,
              agencyId: scenario.agency.one.id,
            },
            scenario.user.four.id
          )
      ).rejects.toThrow('agencyId is invalid or unavailable to this user')
    }
  )
})

describe('identifies user role', () => {
  scenario(
    'identifies current user as USDR admin',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.user.one.id,
        email: scenario.user.one.email,
        roles: ['USDR_ADMIN'],
      })
      const result = currentUserIsUSDRAdmin()

      expect(result).toBeTruthy()
    }
  )

  scenario(
    'identifies current user as not USDR admin',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.user.one.id,
        email: scenario.user.one.email,
        roles: ['ORGANIZATION_STAFF'],
      })
      const result = currentUserIsUSDRAdmin()

      expect(result).toBeFalsy()
    }
  )
})

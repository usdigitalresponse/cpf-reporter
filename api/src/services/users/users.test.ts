import type { User } from '@prisma/client'

import {
  users,
  user,
  createUser,
  updateUser,
  deleteUser,
  currentUserIsUSDRAdmin,
  usersByOrganization,
} from './users'
import type { StandardScenario } from './users.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('users', () => {
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

  scenario('creates a user', async (scenario: StandardScenario) => {
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

  scenario('updates a user', async (scenario: StandardScenario) => {
    mockCurrentUser({
      id: scenario.user.one.id,
      email: scenario.user.one.email,
      roles: ['USDR_ADMIN'],
    })
    const original = (await user({ id: scenario.user.one.id })) as User
    const result = await updateUser({
      id: original.id,
      input: { email: 'String2' },
    })

    expect(result.email).toEqual('String2')
  })

  scenario('deletes a user', async (scenario: StandardScenario) => {
    mockCurrentUser({
      id: scenario.user.one.id,
      email: scenario.user.one.email,
      roles: ['USDR_ADMIN'],
    })
    const original = (await deleteUser({ id: scenario.user.one.id })) as User
    const result = await user({ id: original.id })

    expect(result).toEqual(null)
  })

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

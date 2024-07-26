import type { Organization } from '@prisma/client'

import { getTreasurySignedUrl } from 'src/lib/aws'

import {
  organizations,
  organization,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getOrCreateOrganization,
  downloadTreasuryFile,
} from './organizations'
import type { StandardScenario } from './organizations.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

jest.mock('src/lib/aws', () => ({
  getTreasurySignedUrl: jest.fn(),
}))

describe('organizations', () => {
  scenario(
    'creates or gets an organization',
    async (scenario: StandardScenario) => {
      const resultGet = await getOrCreateOrganization(
        'USDR1',
        'Reporting Period 1'
      )
      const resultCreate = await getOrCreateOrganization(
        'USDR3',
        'Reporting Period 1'
      )
      const resultError = await getOrCreateOrganization('USDR5', 'NO PERIOD')

      expect(resultGet.id).toEqual(scenario.organization.one.id)
      expect(resultCreate.name).toEqual('USDR3')
      expect(
        [scenario.organization.one.id, scenario.organization.two.id].includes(
          resultCreate.id
        )
      ).toBe(false)
      expect(resultError).toBe(undefined)
    }
  )
  scenario('returns all organizations', async () => {
    const result = await organizations()

    expect(result.length).toEqual(3)
  })

  scenario(
    'returns a single organization',
    async (scenario: StandardScenario) => {
      const result = await organization({ id: scenario.organization.one.id })

      expect(result).toEqual(scenario.organization.one)
    }
  )

  scenario('creates a organization', async () => {
    const result = await createOrganization({
      input: { name: 'String' },
    })

    expect(result.name).toEqual('String')
  })

  scenario('updates a organization', async (scenario: StandardScenario) => {
    const original = (await organization({
      id: scenario.organization.one.id,
    })) as Organization
    const result = await updateOrganization({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a organization', async (scenario: StandardScenario) => {
    const original = (await deleteOrganization({
      id: scenario.organization.one.id,
    })) as Organization
    const result = await organization({ id: original.id })

    expect(result).toEqual(null)
  })
})

describe('downloads', () => {
  scenario('returns a download link', async (scenario: StandardScenario) => {
    mockCurrentUser({
      id: 1,
      email: 'admin@usdr.dev',
      role: 'USDR_ADMIN',
      roles: ['USDR_ADMIN'],
      agencyId: 1,
      name: 'Admin',
      agency: {
        id: 1,
        name: 'USDR',
        code: 'USDR',
        organizationId: scenario.organization.one.id,
      },
      createdAt: '2022-02-02T00:00:00Z',
      updatedAt: '2022-02-02T00:00:00Z',
      uploaded: [],
    })
    await downloadTreasuryFile({ input: { fileType: '1A' } })
    expect(getTreasurySignedUrl).toHaveBeenCalled()
  })
  scenario(
    'throws error when invalid organization is provided',
    async (_scenario: StandardScenario) => {
      mockCurrentUser({
        id: 1,
        email: 'admin@usdr.dev',
        role: 'USDR_ADMIN',
        roles: ['USDR_ADMIN'],
        agencyId: 1,
        name: 'Admin',
        agency: {
          id: 1,
          name: 'USDR',
          code: 'USDR',
          organizationId: 99999,
        },
        createdAt: '2022-02-02T00:00:00Z',
        updatedAt: '2022-02-02T00:00:00Z',
        uploaded: [],
      })
      await expect(
        downloadTreasuryFile({ input: { fileType: '1A' } })
      ).rejects.toThrow('Organization with id 99999 not found')
    }
  )
})

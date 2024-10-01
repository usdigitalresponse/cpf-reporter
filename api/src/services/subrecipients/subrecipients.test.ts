import type { Subrecipient } from '@prisma/client'
import type { GraphQLResolveInfo } from 'graphql'

import type { RedwoodGraphQLContext } from '@redwoodjs/graphql-server'

import {
  subrecipients,
  subrecipient,
  createSubrecipient,
  updateSubrecipient,
  deleteSubrecipient,
  Subrecipient as SubrecipientResolver,
} from './subrecipients'
import type { StandardScenario } from './subrecipients.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('subrecipients', () => {
  scenario('returns all subrecipients', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one)
    const result = await subrecipients()

    expect(result.length).toEqual(Object.keys(scenario.subrecipient).length)
  })

  scenario(
    'returns a single subrecipient',
    async (scenario: StandardScenario) => {
      const result = await subrecipient({ id: scenario.subrecipient.one.id })

      expect(result).toEqual(scenario.subrecipient.one)
    }
  )

  scenario('creates a subrecipient', async (scenario: StandardScenario) => {
    const result = await createSubrecipient({
      input: {
        name: 'String',
        organizationId: scenario.subrecipient.two.organizationId,
        ueiTinCombo: '10934985867',
      },
    })

    expect(result.name).toEqual('String')
    expect(result.organizationId).toEqual(
      scenario.subrecipient.two.organizationId
    )
    expect(result.updatedAt).toBeDefined()
  })

  scenario('updates a subrecipient', async (scenario: StandardScenario) => {
    const original = (await subrecipient({
      id: scenario.subrecipient.one.id,
    })) as Subrecipient
    const result = await updateSubrecipient({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a subrecipient', async (scenario: StandardScenario) => {
    const original = (await deleteSubrecipient({
      id: scenario.subrecipient.two.id,
    })) as Subrecipient
    const result = await subrecipient({ id: original.id })

    expect(result).toEqual(null)
  })

  scenario(
    'returns all valid subrecipient uploads',
    async (scenario: StandardScenario) => {
      const result = await subrecipient({ id: scenario.subrecipient.one.id })
      expect(result).toBeDefined()

      const validUploads = await SubrecipientResolver.validSubrecipientUploads(
        {},
        {
          root: result,
          context: {} as RedwoodGraphQLContext,
          info: {} as GraphQLResolveInfo,
        }
      )

      expect(validUploads).toBeDefined()
      expect(validUploads.length).toBe(1)
      expect(validUploads[0].upload.filename).toBe('latest_validation_valid')
      expect(validUploads[0].upload.validations[0].passed).toBe(true)
    }
  )

  scenario(
    'returns all invalid subrecipient uploads',
    async (scenario: StandardScenario) => {
      const result = await subrecipient({ id: scenario.subrecipient.one.id })
      expect(result).toBeDefined()

      const invalidUploads =
        await SubrecipientResolver.invalidSubrecipientUploads(
          {},
          {
            root: result,
            context: {} as RedwoodGraphQLContext,
            info: {} as GraphQLResolveInfo,
          }
        )

      expect(invalidUploads).toBeDefined()
      expect(invalidUploads.length).toBe(1)
      expect(invalidUploads[0].upload.filename).toBe(
        'latest_validation_invalid'
      )
      expect(invalidUploads[0].upload.validations[0].passed).toBe(false)
      expect(invalidUploads[0].upload.validations[0].results).toEqual(
        '{errors: { severity: err }}'
      )
    }
  )
})

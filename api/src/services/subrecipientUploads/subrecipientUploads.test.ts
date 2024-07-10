import type { SubrecipientUpload } from '@prisma/client'

import {
  subrecipientUploads,
  subrecipientUpload,
  createSubrecipientUpload,
  updateSubrecipientUpload,
  deleteSubrecipientUpload,
} from './subrecipientUploads'
import type { StandardScenario } from './subrecipientUploads.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('subrecipientUploads', () => {
  scenario(
    'returns all subrecipientUploads',
    async (scenario: StandardScenario) => {
      const result = await subrecipientUploads()

      expect(result.length).toEqual(
        Object.keys(scenario.subrecipientUpload).length
      )
    }
  )

  scenario(
    'returns a single subrecipientUpload',
    async (scenario: StandardScenario) => {
      const result = await subrecipientUpload({
        id: scenario.subrecipientUpload.one.id,
      })

      expect(result).toEqual(scenario.subrecipientUpload.one)
    }
  )

  scenario(
    'creates a subrecipientUpload',
    async (scenario: StandardScenario) => {
      const result = await createSubrecipientUpload({
        input: {
          subrecipientId: scenario.subrecipient.one.id,
          rawSubrecipient: { foo: 'bar' },
          version: 'V2023_12_12',
          uploadId: scenario.subrecipientUpload.two.uploadId,
        },
      })

      expect(result.subrecipientId).toEqual(
        scenario.subrecipient.one.id
      )
      expect(result.rawSubrecipient).toEqual({ foo: 'bar' })
      expect(result.version).toEqual('V2023_12_12')
    }
  )

  scenario(
    'updates a subrecipientUpload',
    async (scenario: StandardScenario) => {
      const original = (await subrecipientUpload({
        id: scenario.subrecipientUpload.one.id,
      })) as SubrecipientUpload
      const result = await updateSubrecipientUpload({
        id: original.id,
        input: { rawSubrecipient: { 'boo': 'baz' } },
      })

      expect(result.rawSubrecipient).toEqual({ 'boo': 'baz' })
      expect(result.updatedAt).not.toEqual(original.updatedAt)
    }
  )

  scenario(
    'deletes a subrecipientUpload',
    async (scenario: StandardScenario) => {
      const original = (await deleteSubrecipientUpload({
        id: scenario.subrecipientUpload.one.id,
      })) as SubrecipientUpload
      const result = await subrecipientUpload({ id: original.id })

      expect(result).toEqual(null)
    }
  )
})

import type { UploadValidation } from '@prisma/client'

import {
  uploadValidations,
  uploadValidation,
  createUploadValidation,
  updateUploadValidation,
  deleteUploadValidation,
} from './uploadValidations'
import type { StandardScenario } from './uploadValidations.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('uploadValidations', () => {
  scenario(
    'returns all uploadValidations',
    async (scenario: StandardScenario) => {
      const result = await uploadValidations()

      expect(result.length).toEqual(
        Object.keys(scenario.uploadValidation).length
      )
    }
  )

  scenario(
    'returns a single uploadValidation',
    async (scenario: StandardScenario) => {
      const result = await uploadValidation({
        id: scenario.uploadValidation.one.id,
      })

      expect(result).toEqual(scenario.uploadValidation.one)
    }
  )

  scenario('creates a uploadValidation', async (scenario: StandardScenario) => {
    const result = await createUploadValidation({
      input: {
        uploadId: scenario.uploadValidation.two.uploadId,
        agencyId: scenario.uploadValidation.two.agencyId,
        organizationId: scenario.uploadValidation.two.organizationId,
        inputTemplateId: scenario.uploadValidation.two.inputTemplateId,
        updatedAt: '2023-12-08T21:03:20.590Z',
      },
    })

    expect(result.uploadId).toEqual(scenario.uploadValidation.two.uploadId)
    expect(result.agencyId).toEqual(scenario.uploadValidation.two.agencyId)
    expect(result.organizationId).toEqual(
      scenario.uploadValidation.two.organizationId
    )
    expect(result.inputTemplateId).toEqual(
      scenario.uploadValidation.two.inputTemplateId
    )
    expect(result.updatedAt).toEqual(new Date('2023-12-08T21:03:20.590Z'))
  })

  scenario('updates a uploadValidation', async (scenario: StandardScenario) => {
    const original = (await uploadValidation({
      id: scenario.uploadValidation.one.id,
    })) as UploadValidation
    const result = await updateUploadValidation({
      id: original.id,
      input: { updatedAt: '2023-12-09T21:03:20.590Z' },
    })

    expect(result.updatedAt).toEqual(new Date('2023-12-09T21:03:20.590Z'))
  })

  scenario('deletes a uploadValidation', async (scenario: StandardScenario) => {
    const original = (await deleteUploadValidation({
      id: scenario.uploadValidation.one.id,
    })) as UploadValidation
    const result = await uploadValidation({ id: original.id })

    expect(result).toEqual(null)
  })
})

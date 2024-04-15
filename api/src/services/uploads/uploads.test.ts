import type { Upload } from '@prisma/client'

import { db } from 'src/lib/db'

import {
  uploads,
  upload,
  createUpload,
  updateUpload,
  deleteUpload,
  Upload as UploadRelationResolver,
} from './uploads'
import type { StandardScenario } from './uploads.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('uploads', () => {
  scenario('returns all uploads', async (scenario: StandardScenario) => {
    const result = await uploads()

    expect(result.length).toEqual(Object.keys(scenario.upload).length)
  })

  scenario('returns a single upload', async (scenario: StandardScenario) => {
    const result = await upload({ id: scenario.upload.one.id })

    expect(result).toEqual(scenario.upload.one)
  })

  scenario('creates an upload', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one)
    const result = await createUpload({
      input: {
        filename: 'String',
        agencyId: scenario.upload.two.agencyId,
        reportingPeriodId: scenario.upload.two.reportingPeriodId,
      },
    })

    expect(result.filename).toEqual('String')
    expect(result.uploadedById).toEqual(scenario.upload.two.uploadedById)
    expect(result.agencyId).toEqual(scenario.upload.two.agencyId)
    expect(result.reportingPeriodId).toEqual(
      scenario.upload.two.reportingPeriodId
    )

    const validations = await db.upload
      .findUnique({ where: { id: result.id } })
      .validations()
    expect(validations.length).toBe(1)
    expect(validations[0].passed).toBeFalsy()
    expect(validations[0].results).toBeNull()
  })

  scenario('updates an upload', async (scenario: StandardScenario) => {
    const original = (await upload({ id: scenario.upload.one.id })) as Upload
    const result = await updateUpload({
      id: original.id,
      input: { filename: 'String2' },
    })

    expect(result.filename).toEqual('String2')
  })

  scenario('deletes an upload', async (scenario: StandardScenario) => {
    const original = (await deleteUpload({
      id: scenario.upload.one.id,
    })) as Upload
    const result = await upload({ id: original.id })

    expect(result).toEqual(null)
  })

  scenario(
    'returns the latest validation for an upload when there are multiple validations',
    async (scenario: StandardScenario) => {
      const uploadIdOne = scenario.upload.one.id
      const latestValidationOfScenarioOne =
        await UploadRelationResolver.latestValidation(
          {},
          {
            root: {
              id: uploadIdOne,
              agencyId: scenario.upload.one.agencyId,
              createdAt: scenario.upload.one.createdAt,
              filename: scenario.upload.one.filename,
              reportingPeriodId: scenario.upload.one.reportingPeriodId,
              updatedAt: scenario.upload.one.updatedAt,
              uploadedById: scenario.upload.one.uploadedById,
            },
            context: undefined,
            info: undefined,
          }
        )

      const uploadIdTwo = scenario.upload.two.id
      const latestValidationOfScenarioTwo =
        await UploadRelationResolver.latestValidation(
          {},
          {
            root: {
              id: uploadIdTwo,
              agencyId: scenario.upload.two.agencyId,
              createdAt: scenario.upload.two.createdAt,
              filename: scenario.upload.two.filename,
              reportingPeriodId: scenario.upload.two.reportingPeriodId,
              updatedAt: scenario.upload.two.updatedAt,
              uploadedById: scenario.upload.two.uploadedById,
            },
            context: undefined,
            info: undefined,
          }
        )

      expect(latestValidationOfScenarioOne?.createdAt).toEqual(
        new Date('2024-01-27T10:32:00.000Z')
      )
      expect(latestValidationOfScenarioTwo?.createdAt).toEqual(
        new Date('2024-01-29T18:13:25.000Z')
      )
    }
  )
})

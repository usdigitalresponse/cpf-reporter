import type { Upload } from '@prisma/client'

import {
  deleteUploadFile,
  s3UploadFilePutSignedUrl,
  getSignedUrl,
  startStepFunctionExecution,
} from 'src/lib/aws'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

import { updateOrganization } from '../organizations/organizations'

import {
  uploads,
  upload,
  createUpload,
  updateUpload,
  deleteUpload,
  downloadUploadFile,
  Upload as UploadRelationResolver,
  getUploadsByExpenditureCategory,
  sendTreasuryReport,
  SubrecipientLambdaPayload,
  ProjectLambdaPayload,
  CreateArchiveLambdaPayload,
} from './uploads'
import type { StandardScenario } from './uploads.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

jest.mock('src/lib/logger')
jest.mock('src/lib/aws', () => ({
  ...jest.requireActual('src/lib/aws'),
  deleteUploadFile: jest.fn(),
  s3UploadFilePutSignedUrl: jest.fn(),
  getSignedUrl: jest.fn(),
  startStepFunctionExecution: jest.fn(),
}))
jest.mock('uuid', () => ({
  v4: () => '00000000-0000-0000-0000-000000000000',
}))

describe('uploads', () => {
  async function uploadsBelongToOrganization(uploads, expectedOrganizationId) {
    const uploadOrganizationIds = await Promise.all(
      uploads.map(async (upload) => {
        const agency = await db.agency.findUnique({
          where: { id: upload.agencyId },
        })
        return agency?.organizationId
      })
    )

    return uploadOrganizationIds.every(
      (orgId) => orgId === expectedOrganizationId
    )
  }

  scenario('returns a single upload', async (scenario: StandardScenario) => {
    const result = await upload({ id: scenario.upload.one.id })

    expect(result).toEqual(scenario.upload.one)
  })

  scenario(
    'returns all uploads in their organization for organization admins',
    async (scenario: StandardScenario) => {
      mockCurrentUser(scenario.user.one)
      const result = await uploads()
      const uploadsBelongToOrg = await uploadsBelongToOrganization(
        result,
        scenario.organization.one.id
      )

      expect(result.length).toEqual(2)
      expect(uploadsBelongToOrg).toBe(true)
    }
  )

  scenario(
    'returns all uploads in their organization for USDR admins',
    async (scenario: StandardScenario) => {
      mockCurrentUser(scenario.user.two)
      const result = await uploads()
      const uploadsBelongToOrg = await uploadsBelongToOrganization(
        result,
        scenario.organization.one.id
      )

      expect(result.length).toEqual(2)
      expect(uploadsBelongToOrg).toBe(true)
    }
  )

  scenario(
    'returns all uploads in their agency for organization staff',
    async (scenario: StandardScenario) => {
      mockCurrentUser(scenario.user.three)
      const result = await uploads()
      const uploadsBelongToOrg = await uploadsBelongToOrganization(
        result,
        scenario.organization.two.id
      )
      const uploadsBelongToAgency = result.every(async (upload) => {
        return upload.agencyId === scenario.user.three.agencyId
      })

      expect(result.length).toEqual(2)
      expect(uploadsBelongToAgency).toEqual(true)
      expect(uploadsBelongToOrg).toBe(true)
    }
  )

  scenario('creates an upload', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one)
    const result = await createUpload({
      input: {
        filename: 'String',
        agencyId: scenario.upload.two.agencyId,
        reportingPeriodId: scenario.upload.two.reportingPeriodId,
      },
    })

    expect(s3UploadFilePutSignedUrl).toHaveBeenCalled()
    expect(result.filename).toEqual('String')
    expect(result.uploadedById).toEqual(scenario.upload.one.uploadedById)
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
    // mock the s3DeleteObject function
    await deleteUpload({
      id: scenario.upload.one.id,
    })
    expect(deleteUploadFile).not.toHaveBeenCalled()
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

describe('downloads', () => {
  scenario('returns a download link', async (scenario: StandardScenario) => {
    await downloadUploadFile({ id: scenario.upload.one.id })
    expect(getSignedUrl).toHaveBeenCalled()
  })
  scenario('handles a missing value', async (_scenario: StandardScenario) => {
    await expect(downloadUploadFile({ id: -1 })).rejects.toThrow(
      'Upload with id -1 not found'
    )
  })
})

describeScenario<StandardScenario>(
  'uploadCheck',
  'getUploads',
  (getScenario) => {
    let scenario: StandardScenario

    beforeEach(async () => {
      scenario = getScenario()
      await updateOrganization({
        id: scenario.organization.one.id,
        input: {
          preferences: {
            current_reporting_period_id: scenario.reportingPeriod.one.id,
          },
        },
      })
      await updateOrganization({
        id: scenario.organization.two.id,
        input: {
          preferences: {
            current_reporting_period_id: scenario.reportingPeriod.one.id,
          },
        },
      })
    })

    it('returns most recent upload for one category', async () => {
      mockCurrentUser(scenario.user.one)
      const result = await getUploadsByExpenditureCategory(
        scenario.organization.one,
        scenario.reportingPeriod.one
      )
      expect(Object.keys(result).length).toEqual(1)
      expect(Object.keys(result)).toEqual(['1A'])
    })

    it('returns two uploads of different categories', async () => {
      mockCurrentUser(scenario.user.three)
      const result = await getUploadsByExpenditureCategory(
        scenario.organization.two,
        scenario.reportingPeriod.one
      )
      expect(Object.keys(result).length).toEqual(2)
      expect(Object.keys(result).sort()).toEqual(['2A', '1A'].sort())
    })
  }
)

describe('treasury report', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    process.env.TREASURY_STEP_FUNCTION_ARN = 'test-arn'
  })

  scenario(
    'successfully sends a treasury report',
    async (scenario: StandardScenario) => {
      mockCurrentUser(scenario.user.one)
      const mockOrganization = scenario.organization.one
      const mockReportingPeriod = scenario.reportingPeriod.one
      const mockUpload = scenario.upload.two
      const mockUser = scenario.user.one

      const projectPayload: ProjectLambdaPayload = {
        '1A': {
          organization: {
            id: mockOrganization.id,
            preferences: {
              current_reporting_period_id: mockReportingPeriod.id,
            },
          },
          user: {
            email: mockUser.email,
            id: mockUser.id,
          },
          outputTemplateId: mockReportingPeriod.outputTemplateId,
          ProjectType: '1A',
          uploadsToAdd: {
            [mockUpload.agencyId]: {
              objectKey: `uploads/${mockOrganization.id}/${mockUpload.agencyId}/${mockReportingPeriod.id}/${mockUpload.id}/${mockUpload.filename}`,
              createdAt: mockUpload.createdAt,
              filename: mockUpload.filename,
            },
          },
          uploadsToRemove: {},
        },
      }
      const subrecipientPayload: SubrecipientLambdaPayload = {
        Subrecipient: {
          organization: {
            id: mockOrganization.id,
            preferences: {
              current_reporting_period_id: mockReportingPeriod.id,
            },
          },
          user: {
            email: mockUser.email,
            id: mockUser.id,
          },
          outputTemplateId: mockReportingPeriod.outputTemplateId,
        },
      }

      const zipPayload: CreateArchiveLambdaPayload = {
        zip: {
          organization: {
            id: mockOrganization.id,
            preferences: {
              current_reporting_period_id: mockReportingPeriod.id,
            },
          },
        },
      }

      const input = JSON.stringify({
        '1A': {},
        '1B': {},
        '1C': {},
        Subrecipient: {},
        zip: {},
        ...projectPayload,
        ...subrecipientPayload,
        ...zipPayload,
      })
      const result = await sendTreasuryReport()

      expect(result).toBe(true)
      expect(startStepFunctionExecution).toHaveBeenCalledWith(
        'test-arn',
        `Force-kick-off-00000000-0000-0000-0000-000000000000`,
        input
      )
    }
  )

  scenario('handles database errors', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one)
    db.organization.findFirst = jest
      .fn()
      .mockRejectedValue(new Error('Database error'))

    const result = await sendTreasuryReport()

    expect(result).toBe(false)
    expect(logger.error).toHaveBeenCalledWith(
      expect.any(Error),
      'Error sending Treasury Report'
    )
  })
})

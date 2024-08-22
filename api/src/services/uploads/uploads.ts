import { Prisma } from '@prisma/client'
import type { Upload as UploadType } from '@prisma/client'
import type {
  QueryResolvers,
  MutationResolvers,
  UploadRelationResolvers,
} from 'types/graphql'

import { hasRole } from 'src/lib/auth'
import { s3UploadFilePutSignedUrl, getS3UploadFileKey } from 'src/lib/aws'
import aws from 'src/lib/aws'
import { ROLES } from 'src/lib/constants'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import { ValidationError } from 'src/lib/validation-error'

interface WhereInputs {
  agency: { id?: number; organizationId: number }
}

export const uploads: QueryResolvers['uploads'] = () => {
  const currentUser = context.currentUser

  const whereInputs: WhereInputs = {
    agency: {
      organizationId: currentUser.agency.organizationId,
    },
  }

  if (hasRole(ROLES.ORGANIZATION_STAFF)) {
    whereInputs.agency = { ...whereInputs.agency, id: currentUser.agency.id }
  }

  return db.upload.findMany({
    where: whereInputs,
  })
}

export const upload: QueryResolvers['upload'] = ({ id }) => {
  return db.upload.findUnique({
    where: { id },
  })
}

export const createUpload: MutationResolvers['createUpload'] = async ({
  input,
}) => {
  const inputWithContext: Prisma.UploadUncheckedCreateInput = {
    ...input,
    uploadedById: context.currentUser.id,
  }

  const upload = await db.upload.create({
    data: inputWithContext,
  })
  // We don't need to store the result of the validation creation, it will be provided via
  // the relation resolver below
  await db.uploadValidation.create({
    data: {
      uploadId: upload.id,
      initiatedById: upload.uploadedById,
      passed: false,
      results: null,
    },
  })
  const signedUrl = await s3UploadFilePutSignedUrl(
    upload,
    upload.id,
    context.currentUser.agency.organizationId
  )

  return { ...upload, signedUrl }
}

export const updateUpload: MutationResolvers['updateUpload'] = ({
  id,
  input,
}) => {
  return db.upload.update({
    data: input,
    where: { id },
  })
}

export const deleteUpload: MutationResolvers['deleteUpload'] = ({ id }) => {
  // 1. delete any upload validations
  db.uploadValidation.deleteMany({
    where: { uploadId: id },
  })

  // remove object from s3
  const upload = db.upload.findUnique({
    where: { id },
    include: { agency: true },
  })
  if (!upload) {
    throw new ValidationError(`Upload with id ${id} not found`)
  }
  // TODO: fix aws permissions issue on ECS instance. For now, we'll just log the delete
  // deleteUploadFile(upload)
  logger.info({ upload_id: id }, 'deleted database record for upload')

  // 2. delete the upload
  return db.upload.delete({
    where: { id },
  })
}

export const downloadUploadFile: MutationResolvers['downloadUploadFile'] =
  async ({ id }) => {
    const upload = await db.upload.findUnique({
      where: { id },
      include: { agency: true },
    })
    if (!upload) {
      throw new ValidationError(`Upload with id ${id} not found`)
    }
    logger.info(`Downloading file for upload ${id}`)
    const signedUrl = await aws.getSignedUrl(upload)
    return signedUrl
  }

export const Upload: UploadRelationResolvers = {
  uploadedBy: (_obj, { root }) => {
    return db.upload.findUnique({ where: { id: root?.id } }).uploadedBy()
  },
  agency: (_obj, { root }) => {
    return db.upload.findUnique({ where: { id: root?.id } }).agency()
  },
  reportingPeriod: (_obj, { root }) => {
    return db.upload.findUnique({ where: { id: root?.id } }).reportingPeriod()
  },
  expenditureCategory: (_obj, { root }) => {
    return db.upload
      .findUnique({ where: { id: root?.id } })
      .expenditureCategory()
  },
  validations: (_obj, { root }) => {
    return db.upload.findUnique({ where: { id: root?.id } }).validations()
  },
  latestValidation: async (_obj, { root }) => {
    const latestValidation = await db.uploadValidation.findFirst({
      where: { uploadId: root?.id },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return latestValidation
  },
}
type UploadsWithValidationsAndExpenditureCategory = Prisma.UploadGetPayload<{
  include: { validations: true; expenditureCategory: true }
}>
type validUploadInput = {
  organizationId: number
}
type ExpenditureCategoryCode = string
type AgencyId = number
type ValidUploadsByEC = Record<
  ExpenditureCategoryCode,
  Record<AgencyId, UploadPayload>
>
type UploadPayload = {
  objectKey: string
  filename: string
  createdAt: Date
}
/*
This function should return the most recent upload for each expenditure category and agency for the `currentUser`'s organization.
The uploads must be grouped by expenditure category and agency. If there are multiple uploads for the grouping, the most recent upload must be chosen.
The S3 Object key must be set on each upload object.
The return value structure should look like the following:
{
  EC-Code: {
    AgencyId: {
      UploadPayload
    }
  }
}
Example:
{
  '1A': {
    '1': {
      createdAt: '2021-01-01T00:00:00Z',
      filename: 'file1.csv',
      objectKey: 'uploads/1/1/1/1/file1.csv',
    },
  },
  '1B': {
    '2': {
      createdAt: '2021-01-01T00:00:00Z',
      filename: 'file3.csv',
      objectKey: 'uploads/1/1/1/3/file3.csv',
    },
  },
}
*/
export const getUploadsByExpenditureCategory =
  async (): Promise<ValidUploadsByEC> => {
    const organizationId = context.currentUser.agency.organizationId
    const validUploadsInPeriod: UploadsWithValidationsAndExpenditureCategory[] =
      await getValidUploadsInCurrentPeriod({
        organizationId,
      })

    const uploadsByEC: ValidUploadsByEC = {}

    // Get the most recent upload for each expenditure category and agency and set the S3 Object key
    for (const upload of validUploadsInPeriod) {
      const uploadPayload: UploadPayload = {
        objectKey: getS3UploadFileKey(organizationId, upload),
        createdAt: upload.createdAt,
        filename: upload.filename,
      }

      if (!uploadsByEC[upload.expenditureCategory.code]) {
        // The EC code was never added. This is the time to initialize it.
        uploadsByEC[upload.expenditureCategory.code] = {}

        // Set the upload for this agency
        uploadsByEC[upload.expenditureCategory.code][upload.agencyId] =
          uploadPayload

        continue
      }

      if (!uploadsByEC[upload.expenditureCategory.code][upload.agencyId]) {
        // The agency was never added. This is the time to initialize it.
        uploadsByEC[upload.expenditureCategory.code][upload.agencyId] =
          uploadPayload

        continue
      }

      // If the current upload is newer than the one stored, replace it
      if (
        upload.createdAt >
        uploadsByEC[upload.expenditureCategory.code][upload.agencyId].createdAt
      ) {
        uploadsByEC[upload.expenditureCategory.code][upload.agencyId] =
          uploadPayload
      }
    }

    return uploadsByEC
  }

export const getValidUploadsInCurrentPeriod = async ({
  organizationId,
}: validUploadInput): Promise<
  UploadsWithValidationsAndExpenditureCategory[]
> => {
  const organization = await db.organization.findFirst({
    where: { id: organizationId },
  })

  const reportingPeriod = await db.reportingPeriod.findFirst({
    where: { id: organization.preferences['current_reporting_period_id'] },
  })

  /* Step 1: Identify uploads in the given reporting period */
  const uploadsInPeriod = await db.upload.findMany({
    where: {
      reportingPeriodId: reportingPeriod.id,
      agency: { organizationId: organization.id },
    },
    include: { validations: true, expenditureCategory: true },
  })

  /* Step 2: Filter out uploads whose latest validation is not passed */
  const validUploadsInPeriod = uploadsInPeriod
    .filter((upload) => {
      const latestValidation = upload.validations.reduce((latest, current) =>
        current.createdAt > latest.createdAt ? current : latest
      )
      return latestValidation.passed
    })
    .map((upload) => upload)

  return validUploadsInPeriod
}

export const sendTreasuryReport: MutationResolvers['sendTreasuryReport'] =
  async () => {
    try {
      const organization = await db.organization.findFirst({
        where: { id: context.currentUser.agency.organizationId },
      })
      const reportingPeriod = await db.reportingPeriod.findFirst({
        where: { id: organization.preferences['current_reporting_period_id'] },
      })
      const uploadsByExpenditureCategory =
        await getUploadsByExpenditureCategory()
      const arn = process.env.TREASURY_STEP_FUNCTION_ARN

      if (!arn) {
        throw new Error('TREASURY_STEP_FUNCTION_ARN is not set')
      }
      logger.info(uploadsByExpenditureCategory)
      logger.info('Sending Treasury Report')
      /*

class ProjectLambdaPayload(BaseModel):
    organization: OrganizationObj
    user: UserObj
    outputTemplateId: int
    ProjectType: str
    uploadsToAdd: Dict[AgencyId, UploadObj]
    uploadsToRemove: Dict[AgencyId, UploadObj]

class SubrecipientLambdaPayload(BaseModel):
    organization: OrganizationObj
    user: UserObj
    outputTemplateId: int

class CreateArchiveLambdaPayload(BaseModel):
    organization: OrganizationObj

        {
          "1A": {
            "organization": {
              "id": 1,
              "preferences": {
                "current_reporting_period_id": 1
              }
            },
            "user": {
              "email": "foo@example.com",
              "id": 1
            },
            "outputTemplateId": 1,
            "ProjectType": "1A",
            "uploadsToAdd": {
              "1": {
                "id": 1,
                "filename": "file1.csv",
                "objectKey": "uploads/1/1/1/1/file1.csv",
                ...
              },
              "2": {
                "id": 2,
                "filename": "file2.csv",
                "objectKey": "uploads/1/2/1/2/file2.csv",
                ...
              }
            },
            "uploadsToRemove": {}
            }
          }
        }
      */
      const input = {
        reportingPeriod: reportingPeriod.name,
        organization: organization.name,
        email: context.currentUser.email,
        uploadsByExpenditureCategory,
      }

      await aws.startStepFunctionExecution(
        arn,
        undefined,
        JSON.stringify(input),
        ''
      )
      return true
    } catch (error) {
      logger.error(error, 'Error sending Treasury Report')
      return false
    }
  }

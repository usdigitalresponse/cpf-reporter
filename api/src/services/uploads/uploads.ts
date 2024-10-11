import { Prisma } from '@prisma/client'
import type { Organization, ReportingPeriod } from '@prisma/client'
import type {
  QueryResolvers,
  MutationResolvers,
  UploadRelationResolvers,
} from 'types/graphql'
import { v4 as uuidv4 } from 'uuid'

import { RedwoodError } from '@redwoodjs/api'

import { CurrentUser } from 'src/lib/auth'
import { hasRole } from 'src/lib/auth'
import {
  s3UploadFilePutSignedUrl,
  getSignedUrl,
  getS3UploadFileKey,
  startStepFunctionExecution,
} from 'src/lib/aws'
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
      isManual: false,
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
    const signedUrl = await getSignedUrl(upload)
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
type ExpenditureCategoryCode = string
type AgencyId = number
type OrganizationObj = {
  id: number
  preferences: {
    current_reporting_period_id: number
  }
}
type UserObj = {
  email: string
  id: number
}
type UploadPayload = {
  objectKey: string
  filename: string
  createdAt: Date
}
type UploadInfoForProject = {
  organization: OrganizationObj
  user: UserObj
  outputTemplateId: number
  ProjectType: string
  uploadsToAdd: Partial<Record<AgencyId, UploadPayload>>
  uploadsToRemove: Partial<Record<AgencyId, UploadPayload>>
}
type InfoForSubrecipient = {
  organization: OrganizationObj
  user: UserObj
  outputTemplateId: number
}
type InfoForArchive = {
  organization: OrganizationObj
}
type InfoForEmail = {
  organization: OrganizationObj
  user: UserObj
}
/*
This type should be similar to the following python class:
class ProjectLambdaPayload(BaseModel):
*/
export type ProjectLambdaPayload = Record<
  ExpenditureCategoryCode,
  UploadInfoForProject
>
export type SubrecipientLambdaPayload = Record<
  'Subrecipient',
  InfoForSubrecipient
>
export type CreateArchiveLambdaPayload = Record<'zip', InfoForArchive>
export type EmailLambdaPayload = Record<'email', InfoForEmail>

export const getUploadsByExpenditureCategory = async (
  organization: Organization,
  reportingPeriod: ReportingPeriod
): Promise<ProjectLambdaPayload> => {
  const validUploadsInPeriod: UploadsWithValidationsAndExpenditureCategory[] =
    await getValidUploadsInCurrentPeriod(organization, reportingPeriod)

  const commonData = {
    organization: {
      id: organization.id,
      preferences: {
        current_reporting_period_id:
          organization.preferences['current_reporting_period_id'],
      },
    },
    user: {
      email: context.currentUser.email,
      id: context.currentUser.id,
    },
    outputTemplateId: reportingPeriod.outputTemplateId,
    uploadsToAdd: {},
    uploadsToRemove: {},
  }

  const uploadsByEC: ProjectLambdaPayload = {
    '1A': { ...commonData, ProjectType: '1A' },
    '1B': { ...commonData, ProjectType: '1B' },
    '1C': { ...commonData, ProjectType: '1C' },
  }

  // Get the most recent upload for each expenditure category and agency and set the S3 Object key
  for (const upload of validUploadsInPeriod) {
    const uploadPayload: UploadPayload = {
      objectKey: await getS3UploadFileKey(organization.id, upload),
      createdAt: upload.createdAt,
      filename: upload.filename,
    }

    if (
      !uploadsByEC[upload.expenditureCategory.code].uploadsToAdd[
        upload.agencyId
      ]
    ) {
      // The agency was never added. This is the time to initialize it.
      uploadsByEC[upload.expenditureCategory.code].uploadsToAdd[
        upload.agencyId
      ] = uploadPayload

      continue
    }

    // If the current upload is newer than the one stored, replace it
    if (
      upload.createdAt >
      uploadsByEC[upload.expenditureCategory.code].uploadsToAdd[upload.agencyId]
        .createdAt
    ) {
      uploadsByEC[upload.expenditureCategory.code].uploadsToAdd[
        upload.agencyId
      ] = uploadPayload
    }
  }

  return uploadsByEC
}

export const getValidUploadsInCurrentPeriod = async (
  organization: Organization,
  reportingPeriod: ReportingPeriod
): Promise<UploadsWithValidationsAndExpenditureCategory[]> => {
  /* Step 1: Identify uploads in the given reporting period */
  const uploadsInPeriod = await db.upload.findMany({
    where: {
      reportingPeriodId: reportingPeriod.id,
      agency: { organizationId: organization.id },
    },
    include: { validations: true, expenditureCategory: true },
  })

  /* Step 2: Filter out uploads whose latest validation is not passed */
  const validUploadsInPeriod = uploadsInPeriod.filter((upload) => {
    const latestValidation = upload.validations.reduce((latest, current) =>
      current.createdAt > latest.createdAt ? current : latest
    )
    return latestValidation.passed
  })

  return validUploadsInPeriod
}

export const getSubrecipientLambdaPayload = async (
  organization: Organization,
  user: CurrentUser,
  reportingPeriod: ReportingPeriod
): Promise<SubrecipientLambdaPayload> => {
  return {
    Subrecipient: {
      organization: {
        id: organization.id,
        preferences: {
          current_reporting_period_id:
            organization.preferences['current_reporting_period_id'],
        },
      },
      user: {
        email: user.email,
        id: user.id,
      },
      outputTemplateId: reportingPeriod.outputTemplateId,
    },
  }
}

export const getCreateArchiveLambdaPayload = async (
  organization: Organization
): Promise<CreateArchiveLambdaPayload> => {
  return {
    zip: {
      organization: {
        id: organization.id,
        preferences: {
          current_reporting_period_id:
            organization.preferences['current_reporting_period_id'],
        },
      },
    },
  }
}

export const getEmailLambdaPayload = async (
  organization: Organization,
  user: CurrentUser
): Promise<EmailLambdaPayload> => {
  return {
    email: {
      organization: {
        id: organization.id,
        preferences: {
          current_reporting_period_id:
            organization.preferences['current_reporting_period_id'],
        },
      },
      user: {
        email: user.email,
        id: user.id,
      },
    },
  }
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
      const projectLambdaPayload: ProjectLambdaPayload =
        await getUploadsByExpenditureCategory(organization, reportingPeriod)
      const subrecipientLambdaPayload: SubrecipientLambdaPayload =
        await getSubrecipientLambdaPayload(
          organization,
          context.currentUser,
          reportingPeriod
        )
      const createArchiveLambdaPayload: CreateArchiveLambdaPayload =
        await getCreateArchiveLambdaPayload(organization)

      const emailLambdaPayload: EmailLambdaPayload =
        await getEmailLambdaPayload(organization, context.currentUser)

      const input = {
        '1A': {},
        '1B': {},
        '1C': {},
        Subrecipient: {},
        zip: {},
        email: {},
        ...projectLambdaPayload,
        ...subrecipientLambdaPayload,
        ...createArchiveLambdaPayload,
        ...emailLambdaPayload,
      }

      await startStepFunctionExecution(
        process.env.TREASURY_STEP_FUNCTION_ARN,
        `Force-kick-off-${uuidv4()}`,
        JSON.stringify(input)
      )
      return true
    } catch (error) {
      logger.error(error, 'Error sending Treasury Report')
      throw new RedwoodError(error.message)
    }
  }

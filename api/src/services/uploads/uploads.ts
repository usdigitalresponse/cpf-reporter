import { Prisma } from '@prisma/client'
import type {
  QueryResolvers,
  MutationResolvers,
  UploadRelationResolvers,
} from 'types/graphql'

import { hasRole } from 'src/lib/auth'
import { s3PutSignedUrl, getS3UploadFileKey } from 'src/lib/aws'
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
  const signedUrl = await s3PutSignedUrl(
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

/*
This function should return the most recent upload for each expenditure category and agency for the `currentUser`'s organization.
The uploads must be grouped by expenditure category and agency. If there are multiple uploads for the grouping, the most recent upload must be chosen.
The S3 Object key must be set on each upload object.
The return value structure should look like the following:
{
  EC-Code: {
    AgencyId: {
      UploadObject
    }
  }
}
Example:
{
  '1A': {
    '1': {
      id: 1,
      filename: 'file1.csv',
      objectKey: 'uploads/1/1/1/1/file1.csv',
      ...
    },
    '2': {
      id: 2,
      filename: 'file2.csv',
      objectKey: 'uploads/1/2/1/2/file2.csv',
      ...
    },
    ...
  },
  '1B': {
    '1': {
      id: 3,
      filename: 'file3.csv',
      objectKey: 'uploads/1/1/1/3/file3.csv',
      ...
    },
    ...
  },
  ...
}
*/
export const getUploadsByExpenditureCategory = async () => {
  const organization = await db.organization.findFirst({
    where: { id: context.currentUser.agency.organizationId },
  })

  const reportingPeriod = await db.reportingPeriod.findFirst({
    where: { id: organization.preferences['current_reporting_period_id'] },
  })

  // valid upload validations
  const validUploadIds = await db.uploadValidation.findMany({
    where: {
      passed: true,
      upload: { agency: { organizationId: organization.id } },
    },
    select: {
      uploadId: true,
    },
    distinct: ['uploadId'],
  })

  const uploadsForPeriod = await db.upload.findMany({
    where: {
      reportingPeriodId: reportingPeriod.id,
      agency: { organizationId: organization.id },
      id: { in: validUploadIds.map((v) => v.uploadId) },
    },
    include: { expenditureCategory: true },
  })

  const uploadsByExpenditureCategory = {}

  // Get the most recent upload for each expenditure category and agency and set the S3 Object key
  for (const upload of uploadsForPeriod)  {
    // Set the S3 Object key
    const objectKey = getS3UploadFileKey(organization.id, upload)
    upload.objectKey = objectKey

    // Filter the uploads by expenditure category of the current upload.
    const uploadsByAgency =
      uploadsByExpenditureCategory[upload.expenditureCategory.code]

    if (!uploadsByAgency) {
      // The EC code was never added. This is the time to initialize it.
      uploadsByExpenditureCategory[upload.expenditureCategory.code] = {}

      // Set the upload for this agency
      uploadsByExpenditureCategory[upload.expenditureCategory.code][
        upload.agencyId
      ] = upload
    } else {
      if (!uploadsByAgency[upload.agencyId]) {
        // The agency was never added. This is the time to initialize it.
        uploadsByExpenditureCategory[upload.expenditureCategory.code][
          upload.agencyId
        ] = upload
      } else {
        // If the current upload is newer than the one stored, replace it
        if (upload.createdAt > uploadsByAgency[upload.agencyId].createdAt) {
          uploadsByExpenditureCategory[upload.expenditureCategory.code][
            upload.agencyId
          ] = upload
        }
      }
    }
  }

  return uploadsByExpenditureCategory
}

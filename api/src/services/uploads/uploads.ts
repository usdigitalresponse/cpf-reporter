import { Prisma } from '@prisma/client'
import type {
  QueryResolvers,
  MutationResolvers,
  UploadRelationResolvers,
} from 'types/graphql'

import { s3PutSignedUrl } from 'src/lib/aws'
import aws from 'src/lib/aws'
import { ROLES } from 'src/lib/constants'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import { ValidationError } from 'src/lib/validation-error'

export const uploads: QueryResolvers['uploads'] = () => {
  const currentUser = context.currentUser

  if (currentUser.role === ROLES.ORGANIZATION_STAFF) {
    return db.upload.findMany({
      where: {
        uploadedById: currentUser.id,
      },
    })
  } else if (
    currentUser.role === ROLES.ORGANIZATION_ADMIN ||
    currentUser.role === ROLES.USDR_ADMIN
  ) {
    return db.upload.findMany({
      where: {
        agency: {
          organizationId: currentUser.agency.organizationId,
        },
      },
    })
  }
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

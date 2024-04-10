import type {
  QueryResolvers,
  MutationResolvers,
  UploadRelationResolvers,
} from 'types/graphql'

import { s3PutSignedUrl } from 'src/lib/aws'
import { db } from 'src/lib/db'

export const uploads: QueryResolvers['uploads'] = () => {
  return db.upload.findMany()
}

export const upload: QueryResolvers['upload'] = ({ id }) => {
  return db.upload.findUnique({
    where: { id },
  })
}

export const createUpload: MutationResolvers['createUpload'] = async ({
  input,
}) => {
  const upload = await db.upload.create({
    data: input,
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
  const signedUrl = await s3PutSignedUrl(upload, upload.id)

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

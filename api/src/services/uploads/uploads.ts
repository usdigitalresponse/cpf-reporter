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
  organization: (_obj, { root }) => {
    return db.upload.findUnique({ where: { id: root?.id } }).organization()
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
  subrecipients: (_obj, { root }) => {
    return db.upload.findUnique({ where: { id: root?.id } }).subrecipients()
  },
}

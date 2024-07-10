import type {
  QueryResolvers,
  MutationResolvers,
  SubrecipientUploadRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const subrecipientUploads: QueryResolvers['subrecipientUploads'] =
  () => {
    return db.subrecipientUpload.findMany()
  }

export const subrecipientUpload: QueryResolvers['subrecipientUpload'] = ({
  id,
}) => {
  return db.subrecipientUpload.findUnique({
    where: { id },
  })
}

export const createSubrecipientUpload: MutationResolvers['createSubrecipientUpload'] =
  ({ input }) => {
    return db.subrecipientUpload.create({
      data: input,
    })
  }

export const updateSubrecipientUpload: MutationResolvers['updateSubrecipientUpload'] =
  ({ id, input }) => {
    return db.subrecipientUpload.update({
      data: input,
      where: { id },
    })
  }

export const deleteSubrecipientUpload: MutationResolvers['deleteSubrecipientUpload'] =
  ({ id }) => {
    return db.subrecipientUpload.delete({
      where: { id },
    })
  }

export const SubrecipientUpload: SubrecipientUploadRelationResolvers = {
  subrecipient: (_obj, { root }) => {
    return db.subrecipientUpload
      .findUnique({ where: { id: root?.id } })
      .subrecipient()
  },
  upload: (_obj, { root }) => {
    return db.subrecipientUpload
      .findUnique({ where: { id: root?.id } })
      .upload()
  }
}

import type {
  QueryResolvers,
  MutationResolvers,
  UploadValidationRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const uploadValidations: QueryResolvers['uploadValidations'] = () => {
  return db.uploadValidation.findMany()
}

export const uploadValidation: QueryResolvers['uploadValidation'] = ({
  id,
}) => {
  return db.uploadValidation.findUnique({
    where: { id },
  })
}

export const createUploadValidation: MutationResolvers['createUploadValidation'] =
  ({ input }) => {
    return db.uploadValidation.create({
      data: input,
    })
  }

export const updateUploadValidation: MutationResolvers['updateUploadValidation'] =
  ({ id, input }) => {
    return db.uploadValidation.update({
      data: input,
      where: { id },
    })
  }

export const deleteUploadValidation: MutationResolvers['deleteUploadValidation'] =
  ({ id }) => {
    return db.uploadValidation.delete({
      where: { id },
    })
  }

export const UploadValidation: UploadValidationRelationResolvers = {
  upload: (_obj, { root }) => {
    return db.uploadValidation.findUnique({ where: { id: root?.id } }).upload()
  },
  agency: (_obj, { root }) => {
    return db.uploadValidation.findUnique({ where: { id: root?.id } }).agency()
  },
  organizaiton: (_obj, { root }) => {
    return db.uploadValidation
      .findUnique({ where: { id: root?.id } })
      .organizaiton()
  },
  inputTemplate: (_obj, { root }) => {
    return db.uploadValidation
      .findUnique({ where: { id: root?.id } })
      .inputTemplate()
  },
  validatedBy: (_obj, { root }) => {
    return db.uploadValidation
      .findUnique({ where: { id: root?.id } })
      .validatedBy()
  },
  invalidatedBy: (_obj, { root }) => {
    return db.uploadValidation
      .findUnique({ where: { id: root?.id } })
      .invalidatedBy()
  },
}

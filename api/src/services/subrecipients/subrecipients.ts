import type {
  QueryResolvers,
  MutationResolvers,
  SubrecipientRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const subrecipients: QueryResolvers['subrecipients'] = () => {
  return db.subrecipient.findMany()
}

export const subrecipient: QueryResolvers['subrecipient'] = ({ id }) => {
  return db.subrecipient.findUnique({
    where: { id },
  })
}

export const createSubrecipient: MutationResolvers['createSubrecipient'] = ({
  input,
}) => {
  return db.subrecipient.create({
    data: input,
  })
}

export const updateSubrecipient: MutationResolvers['updateSubrecipient'] = ({
  id,
  input,
}) => {
  return db.subrecipient.update({
    data: input,
    where: { id },
  })
}

export const deleteSubrecipient: MutationResolvers['deleteSubrecipient'] = ({
  id,
}) => {
  return db.subrecipient.delete({
    where: { id },
  })
}

export const Subrecipient: SubrecipientRelationResolvers = {
  organization: (_obj, { root }) => {
    return db.subrecipient
      .findUnique({ where: { id: root?.id } })
      .organization()
  },
  certifiedBy: (_obj, { root }) => {
    return db.subrecipient.findUnique({ where: { id: root?.id } }).certifiedBy()
  },
  originationUpload: (_obj, { root }) => {
    return db.subrecipient
      .findUnique({ where: { id: root?.id } })
      .originationUpload()
  },
}

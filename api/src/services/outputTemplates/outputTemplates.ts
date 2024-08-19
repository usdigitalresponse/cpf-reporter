import type {
  QueryResolvers,
  MutationResolvers,
  OutputTemplateRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const outputTemplates: QueryResolvers['outputTemplates'] = () => {
  return db.outputTemplate.findMany()
}

export const outputTemplate: QueryResolvers['outputTemplate'] = ({ id }) => {
  return db.outputTemplate.findUnique({
    where: { id },
  })
}

export const createOutputTemplate: MutationResolvers['createOutputTemplate'] =
  ({ input }) => {
    return db.outputTemplate.create({
      data: input,
    })
  }

export const updateOutputTemplate: MutationResolvers['updateOutputTemplate'] =
  ({ id, input }) => {
    return db.outputTemplate.update({
      data: input,
      where: { id },
    })
  }

export const deleteOutputTemplate: MutationResolvers['deleteOutputTemplate'] =
  ({ id }) => {
    return db.outputTemplate.delete({
      where: { id },
    })
  }

export const OutputTemplate: OutputTemplateRelationResolvers = {
  reportingPeriods: (_obj, { root }) => {
    return db.outputTemplate
      .findUnique({ where: { id: root?.id } })
      .reportingPeriods()
  },
}

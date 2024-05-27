import type {
  QueryResolvers,
  MutationResolvers,
  ValidationRulesRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const validationRuleses: QueryResolvers['validationRuleses'] = () => {
  return db.validationRules.findMany()
}

export const validationRules: QueryResolvers['validationRules'] = ({ id }) => {
  return db.validationRules.findUnique({
    where: { id },
  })
}

export const createValidationRules: MutationResolvers['createValidationRules'] =
  ({ input }) => {
    return db.validationRules.create({
      data: input,
    })
  }

export const updateValidationRules: MutationResolvers['updateValidationRules'] =
  ({ id, input }) => {
    return db.validationRules.update({
      data: input,
      where: { id },
    })
  }

export const deleteValidationRules: MutationResolvers['deleteValidationRules'] =
  ({ id }) => {
    return db.validationRules.delete({
      where: { id },
    })
  }

export const ValidationRules: ValidationRulesRelationResolvers = {
  validations: (_obj, { root }) => {
    return db.validationRules
      .findUnique({ where: { id: root?.id } })
      .validations()
  },
  reportingPeriods: (_obj, { root }) => {
    return db.validationRules
      .findUnique({ where: { id: root?.id } })
      .reportingPeriods()
  },
}

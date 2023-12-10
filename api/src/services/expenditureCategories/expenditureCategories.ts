import type {
  QueryResolvers,
  MutationResolvers,
  ExpenditureCategoryRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const expenditureCategories: QueryResolvers['expenditureCategories'] =
  () => {
    return db.expenditureCategory.findMany()
  }

export const expenditureCategory: QueryResolvers['expenditureCategory'] = ({
  id,
}) => {
  return db.expenditureCategory.findUnique({
    where: { id },
  })
}

export const createExpenditureCategory: MutationResolvers['createExpenditureCategory'] =
  ({ input }) => {
    return db.expenditureCategory.create({
      data: input,
    })
  }

export const updateExpenditureCategory: MutationResolvers['updateExpenditureCategory'] =
  ({ id, input }) => {
    return db.expenditureCategory.update({
      data: input,
      where: { id },
    })
  }

export const deleteExpenditureCategory: MutationResolvers['deleteExpenditureCategory'] =
  ({ id }) => {
    return db.expenditureCategory.delete({
      where: { id },
    })
  }

export const ExpenditureCategory: ExpenditureCategoryRelationResolvers = {
  Uploads: (_obj, { root }) => {
    return db.expenditureCategory
      .findUnique({ where: { id: root?.id } })
      .Uploads()
  },
}

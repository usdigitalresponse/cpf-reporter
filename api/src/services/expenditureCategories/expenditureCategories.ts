import type { Prisma } from '@prisma/client'
import type {
  QueryResolvers,
  MutationResolvers,
  ExpenditureCategoryRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import { EXPENDITURE_CATEGORIES } from 'src/lib/constants'

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

export const createOrSkipInitialExpenditureCategories = async () => {
  // This function is used to create initial expenditure categories
  // It is intended to only be called via the `onboardOrganization` script
  // Hence, we hard-return if we detect a non-empty context
  if (context && Object.keys(context).length > 0) {
    logger.error({ custom: context },
      `This function is intended to be called via the onboardOrganization script and not via GraphQL API. Skipping...`
    )
    return
  }

  try {
    const expenditureCategoriesData = Object.entries(EXPENDITURE_CATEGORIES).map(
      ([code, name]) => ({ code, name })
    )
    await Promise.all(
      expenditureCategoriesData.map(
        async (data: Prisma.ExpenditureCategoryCreateArgs['data']) => {
          const existingExpenditureCategory =
            await db.expenditureCategory.findFirst({ where: { name: data.name } })
          if (existingExpenditureCategory) {
            logger.info(
              `Expenditure category ${data.name} already exists. Skipping...`
            )
            return
          }
          const record = await db.expenditureCategory.create({ data })
          logger.info(`Created expenditure category ${record.name}`)
        }
      )
    )
  } catch (error) {
    logger.error(error, 'Error creating or skipping initial expenditure categories')
  }
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

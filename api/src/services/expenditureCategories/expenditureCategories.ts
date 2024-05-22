import type { Prisma } from '@prisma/client'
import type {
  QueryResolvers,
  MutationResolvers,
  ExpenditureCategoryRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

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
  const expendtitureCategoriesData = [
    {
      name: '1A - Broadband Infrastructure',
      code: '1A',
    },
    {
      name: '1B - Digital Connectivity Technology',
      code: '1B',
    },
    {
      name: '1C - Multi-Purpose Community Facility',
      code: '1C',
    },
  ]
  await Promise.all(
    expendtitureCategoriesData.map(
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

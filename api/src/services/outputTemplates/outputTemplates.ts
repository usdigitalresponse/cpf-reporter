import type {
  QueryResolvers,
  MutationResolvers,
  OutputTemplateRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

export const outputTemplates: QueryResolvers['outputTemplates'] = () => {
  return db.outputTemplate.findMany()
}

export const outputTemplate: QueryResolvers['outputTemplate'] = ({ id }) => {
  return db.outputTemplate.findUnique({
    where: { id },
  })
}

export const getOrCreateOutputTemplate = async (outputTemplateInfo) => {
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
    let outputTemplateRecord

    const existingOutputTemplate = await db.outputTemplate.findFirst({
      where: { name: outputTemplateInfo.name },
    })
    if (existingOutputTemplate) {
      logger.info(`Output template ${outputTemplateInfo.name} already exists`)
      outputTemplateRecord = existingOutputTemplate
    } else {
      logger.info(`Creating ${outputTemplateInfo.name}`)
      const data = outputTemplateInfo
      outputTemplateRecord = await db.outputTemplate.create({
        data,
      })
    }
    return outputTemplateRecord
  } catch (error) {
    logger.error(error, `Error getting or creating output template ${outputTemplateInfo.name}`)
  }
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

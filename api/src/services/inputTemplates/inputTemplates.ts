import type {
  QueryResolvers,
  MutationResolvers,
  InputTemplateRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

export const inputTemplates: QueryResolvers['inputTemplates'] = () => {
  return db.inputTemplate.findMany()
}

export const inputTemplate: QueryResolvers['inputTemplate'] = ({ id }) => {
  return db.inputTemplate.findUnique({
    where: { id },
  })
}

export const getOrCreateInputTemplate = async (inputTemplateInfo) => {
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
    let inputTemplateRecord

    const existingInputTemplate = await db.inputTemplate.findFirst({
      where: { name: inputTemplateInfo.name },
    })
    if (existingInputTemplate) {
      logger.info(`Input template ${inputTemplateInfo.name} already exists`)
      inputTemplateRecord = existingInputTemplate
    } else {
      logger.info(`Creating ${inputTemplateInfo.name}`)
      const data = inputTemplateInfo
      inputTemplateRecord = await db.inputTemplate.create({
        data,
      })
    }
    return inputTemplateRecord
  } catch (error) {
    logger.error(error, `Error getting or creating input template ${inputTemplateInfo.name}`)
  }
}

export const createInputTemplate: MutationResolvers['createInputTemplate'] = ({
  input,
}) => {
  return db.inputTemplate.create({
    data: input,
  })
}

export const updateInputTemplate: MutationResolvers['updateInputTemplate'] = ({
  id,
  input,
}) => {
  return db.inputTemplate.update({
    data: input,
    where: { id },
  })
}

export const deleteInputTemplate: MutationResolvers['deleteInputTemplate'] = ({
  id,
}) => {
  return db.inputTemplate.delete({
    where: { id },
  })
}

export const InputTemplate: InputTemplateRelationResolvers = {
  reportingPeriods: (_obj, { root }) => {
    return db.inputTemplate
      .findUnique({ where: { id: root?.id } })
      .reportingPeriods()
  },
}

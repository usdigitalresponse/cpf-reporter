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
  try {
    let inputTemplateRecord

    const existingInputTemplate = await db.inputTemplate.findFirst({
      where: { name: inputTemplateInfo.name },
    })
    if (existingInputTemplate) {
      inputTemplateRecord = existingInputTemplate
    } else {
      const data = inputTemplateInfo
      inputTemplateRecord = await db.inputTemplate.create({
        data,
      })
    }
    return inputTemplateRecord
  } catch (error) {
    logger.error(`Error creating input template ${inputTemplateInfo.name}`)
    logger.error(error)
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

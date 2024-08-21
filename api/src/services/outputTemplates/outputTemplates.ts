import type {
  QueryResolvers,
  MutationResolvers,
  OutputTemplateRelationResolvers,
} from 'types/graphql'

import { s3OutputTemplatePutSignedUrl } from 'src/lib/aws'
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
    logger.error(
      { custom: context },
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
    logger.error(
      error,
      `Error getting or creating output template ${outputTemplateInfo.name}`
    )
  }
}

export const createOutputTemplate: MutationResolvers['createOutputTemplate'] =
  async ({ input }) => {
    // Extract filenames from input
    const filenames = input.filenames
    delete input.filenames

    const outputTemplate = await db.outputTemplate.create({
      data: input,
    })

    const cpf1AUrl = await s3OutputTemplatePutSignedUrl(
      outputTemplate.id,
      filenames.CPF1A
    )
    const cpf1BUrl = await s3OutputTemplatePutSignedUrl(
      outputTemplate.id,
      filenames.CPF1B
    )
    const cpf1CUrl = await s3OutputTemplatePutSignedUrl(
      outputTemplate.id,
      filenames.CPF1C
    )
    const subrecipientUrl = await s3OutputTemplatePutSignedUrl(
      outputTemplate.id,
      filenames.CPFSubrecipient
    )
    const signedUrls = {
      CPF1A: cpf1AUrl,
      CPF1B: cpf1BUrl,
      CPF1C: cpf1CUrl,
      CPFSubrecipient: subrecipientUrl,
    }

    return {
      outputTemplate,
      signedUrls,
    }
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

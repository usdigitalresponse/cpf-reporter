import type {
  QueryResolvers,
  MutationResolvers,
  ReportingPeriodRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

export const reportingPeriods: QueryResolvers['reportingPeriods'] = () => {
  return db.reportingPeriod.findMany()
}

export const reportingPeriod: QueryResolvers['reportingPeriod'] = ({ id }) => {
  return db.reportingPeriod.findUnique({
    where: { id },
  })
}

export const getOrCreateReportingPeriod = async (periodInfo) => {
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
    let reportingPeriodRecord

    const existingReportingPeriod = await db.reportingPeriod.findFirst({
      where: { name: periodInfo.name },
    })
    if (existingReportingPeriod) {
      logger.info(`Reporting period ${periodInfo.name} already exists`)
      reportingPeriodRecord = existingReportingPeriod
    } else {
      const outputTemplate = await db.outputTemplate.findFirst({
        where: { name: periodInfo.outputTemplateName },
      })
      if (!outputTemplate) {
        logger.error(
          `Output template ${periodInfo.outputTemplateName} does not exist. Cannot create reporting period.`
        )
        return
      }
      const inputTemplate = await db.inputTemplate.findFirst({
        where: { name: periodInfo.inputTemplateName },
      })
      if (!inputTemplate) {
        logger.error(
          `Input template ${periodInfo.inputTemplateName} does not exist. Cannot create reporting period.`
        )
        return
      }
      logger.info(`Creating ${periodInfo.name}`)
      const data = {
        name: periodInfo.name,
        startDate: periodInfo.startDate,
        endDate: periodInfo.endDate,
        inputTemplateId: inputTemplate.id,
        outputTemplateId: outputTemplate.id,
      }
      reportingPeriodRecord = await db.reportingPeriod.create({
        data,
      })
    }
    return reportingPeriodRecord
  } catch (error) {
    logger.error(
      error,
      `Error getting or creating reporting period ${periodInfo.name}`
    )
  }
}

export const createReportingPeriod: MutationResolvers['createReportingPeriod'] =
  ({ input }) => {
    return db.reportingPeriod.create({
      data: input,
    })
  }

export const updateReportingPeriod: MutationResolvers['updateReportingPeriod'] =
  ({ id, input }) => {
    return db.reportingPeriod.update({
      data: input,
      where: { id },
    })
  }

export const deleteReportingPeriod: MutationResolvers['deleteReportingPeriod'] =
  ({ id }) => {
    return db.reportingPeriod.delete({
      where: { id },
    })
  }

export const ReportingPeriod: ReportingPeriodRelationResolvers = {
  inputTemplate: (_obj, { root }) => {
    return db.reportingPeriod
      .findUnique({ where: { id: root?.id } })
      .inputTemplate()
  },
  outputTemplate: (_obj, { root }) => {
    return db.reportingPeriod
      .findUnique({ where: { id: root?.id } })
      .outputTemplate()
  },
  uploads: (_obj, { root }) => {
    return db.reportingPeriod.findUnique({ where: { id: root?.id } }).uploads()
  },
  projects: (_obj, { root }) => {
    return db.reportingPeriod.findUnique({ where: { id: root?.id } }).projects()
  },
  validationRules: (_obj, { root }) => {
    return db.reportingPeriod
      .findUnique({ where: { id: root?.id } })
      .outputTemplate()
  },
}

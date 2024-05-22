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
  try {
    let reportingPeriodRecord

    const existingReportingPeriod = await db.reportingPeriod.findFirst({
      where: { name: periodInfo.name },
    })
    if (existingReportingPeriod) {
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
    logger.error(`Error creating reporting period ${periodInfo.name}`)
    logger.error(error)
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
  organization: (_obj, { root }) => {
    return db.reportingPeriod
      .findUnique({ where: { id: root?.id } })
      .organization()
  },
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

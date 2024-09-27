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

export const reportingPeriodsWithCertification = async () => {
  const organizationId = context.currentUser?.agency?.organizationId

  const reportingPeriods = await db.reportingPeriod.findMany({
    include: {
      certifications: {
        where: { organizationId },
        include: { certifiedBy: true },
      },
    },
    orderBy: { startDate: 'asc' },
  })

  return reportingPeriods.map((period) => ({
    ...period,
    certificationForOrganization: period.certifications[0] || null,
  }))
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

export const certifyReportingPeriodAndOpenNextPeriod = async ({
  reportingPeriodId,
}: {
  reportingPeriodId: number
}) => {
  const currentUser = context.currentUser
  const organizationId = currentUser?.agency?.organizationId

  if (!organizationId) {
    throw new Error('Current user must be associated with an organization')
  }

  try {
    const newReportingPeriod = await db.$transaction(async (prisma) => {
      const currentReportingPeriod = await db.reportingPeriod.findUnique({
        where: { id: reportingPeriodId },
      })
      if (!currentReportingPeriod) {
        throw new Error(
          `Reporting period with id ${reportingPeriodId} not found`
        )
      }

      // Find the next reporting period
      const nextReportingPeriod = await db.reportingPeriod.findFirst({
        where: { startDate: { gt: currentReportingPeriod.startDate } },
        orderBy: { startDate: 'asc' },
      })
      if (!nextReportingPeriod) {
        throw new Error('No next reporting period found')
      }

      await prisma.reportingPeriodCertification.create({
        data: {
          reportingPeriodId,
          organizationId,
          certifiedById: currentUser.id,
        },
      })

      const preferences = {
        current_reporting_period_id: nextReportingPeriod.id,
      }
      await db.organization.update({
        data: { preferences },
        where: { id: organizationId },
      })

      return nextReportingPeriod
    })

    return newReportingPeriod
  } catch (err) {
    // If anything goes wrong, the transaction will be rolled back
    if (err instanceof Error) {
      throw err
    }
    throw new Error(
      `Couldn't certify reporting period with id ${reportingPeriodId}`
    )
  }
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
  certifications: (_obj, { root }) => {
    return db.reportingPeriod
      .findUnique({ where: { id: root?.id } })
      .certifications()
  },
}

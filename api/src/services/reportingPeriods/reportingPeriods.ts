import type {
  QueryResolvers,
  MutationResolvers,
  ReportingPeriodRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const reportingPeriods: QueryResolvers['reportingPeriods'] = () => {
  return db.reportingPeriod.findMany()
}

/**
 * Get all reporting periods that either match supplied period ID or are older
 * than supplied period ID.
 *
 * @returns The matching reporting periods, sorted from oldest to newest by date
 */
export const previousReportingPeriods: QueryResolvers['previousReportingPeriods'] =
  async ({ id, organizationId }) => {
    const currentPeriod = await db.reportingPeriod.findUnique({
      where: { id },
    })
    const allPeriods = await db.reportingPeriod.findMany({
      where: { organizationId },
    })
    const reportingPeriods = allPeriods.filter(
      (period) => new Date(period.endDate) <= new Date(currentPeriod.endDate)
    )
    reportingPeriods.sort((a, b) => a.endDate.getTime() - b.endDate.getTime())
    return reportingPeriods
  }

export const reportingPeriod: QueryResolvers['reportingPeriod'] = ({ id }) => {
  return db.reportingPeriod.findUnique({
    where: { id },
  })
}

export const reportingPeriodsByOrg: QueryResolvers['reportingPeriodsByOrg'] =
  async ({ organizationId }) => {
    const reportingPeriods = db.reportingPeriod.findMany({
      where: { organizationId },
    })
    return reportingPeriods || [] // Return an empty array if null is received
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
  certifiedBy: (_obj, { root }) => {
    return db.reportingPeriod
      .findUnique({ where: { id: root?.id } })
      .certifiedBy()
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
}

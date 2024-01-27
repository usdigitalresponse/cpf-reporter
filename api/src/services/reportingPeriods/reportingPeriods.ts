import type {
  QueryResolvers,
  MutationResolvers,
  ReportingPeriodRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const reportingPeriods: QueryResolvers['reportingPeriods'] = () => {
  return db.reportingPeriod.findMany()
}

export const reportingPeriod: QueryResolvers['reportingPeriod'] = ({ id }) => {
  return db.reportingPeriod.findUnique({
    where: { id },
  })
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

export const currentPeriodForOrganization: QueryResolvers['currentPeriodForOrganization'] =
({ organizationId }) => {
  return db.reportingPeriod.findFirst({
    where: { organizationId, isCurrentPeriod: true },
  })
}

export const ReportingPeriod: ReportingPeriodRelationResolvers = {
  organization: (_obj, { root }) => {
    return db.reportingPeriod
      .findUnique({ where: { id: root?.id } })
      .organization()
  },
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
  uploads: (_obj, { root }) => {
    return db.reportingPeriod.findUnique({ where: { id: root?.id } }).uploads()
  },
  projects: (_obj, { root }) => {
    return db.reportingPeriod.findUnique({ where: { id: root?.id } }).projects()
  },
}

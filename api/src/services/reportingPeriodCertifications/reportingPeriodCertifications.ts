import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const reportingPeriodCertifications: QueryResolvers['reportingPeriodCertifications'] =
  () => {
    return db.reportingPeriodCertification.findMany()
  }

export const reportingPeriodCertification: QueryResolvers['reportingPeriodCertification'] =
  ({ id }) => {
    return db.reportingPeriodCertification.findUnique({
      where: { id },
    })
  }

export const createReportingPeriodCertification: MutationResolvers['createReportingPeriodCertification'] =
  ({ input }) => {
    return db.reportingPeriodCertification.create({
      data: input,
    })
  }

export const updateReportingPeriodCertification: MutationResolvers['updateReportingPeriodCertification'] =
  ({ id, input }) => {
    return db.reportingPeriodCertification.update({
      data: input,
      where: { id },
    })
  }

export const deleteReportingPeriodCertification: MutationResolvers['deleteReportingPeriodCertification'] =
  ({ id }) => {
    return db.reportingPeriodCertification.delete({
      where: { id },
    })
  }

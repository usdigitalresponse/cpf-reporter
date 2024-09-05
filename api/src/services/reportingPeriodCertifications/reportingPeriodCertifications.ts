import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { AuthenticationError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'
import { currentUserIsUSDRAdmin } from 'src/services/users'

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
    if (!currentUserIsUSDRAdmin()) {
      throw new AuthenticationError(
        "You don't have permission to certify reporting periods."
      )
    }

    const { currentUser } = context
    const organizationId = currentUser.agency.organizationId

    return db.reportingPeriodCertification.create({
      data: {
        ...input,
        organizationId,
        certifiedById: currentUser.id,
      },
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

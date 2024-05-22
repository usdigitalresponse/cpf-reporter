import type {
  QueryResolvers,
  MutationResolvers,
  OrganizationRelationResolvers,
} from 'types/graphql'
import type { Prisma } from '@prisma/client'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

export const organizations: QueryResolvers['organizations'] = () => {
  return db.organization.findMany()
}

export const organization: QueryResolvers['organization'] = ({ id }) => {
  return db.organization.findUnique({
    where: { id },
  })
}

export const createOrganization: MutationResolvers['createOrganization'] = ({
  input,
}) => {
  return db.organization.create({
    data: input,
  })
}

export const getOrCreateOrganization = async (orgName, reportingPeriodName) => {
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
    let orgRecord

    const existingOrganization = await db.organization.findFirst({
      where: { name: orgName },
    })
    if (existingOrganization) {
      logger.info(`Organization ${orgName} already exists`)
      orgRecord = existingOrganization
    } else {
      logger.info(`Creating ${orgName}`)
      const data: Prisma.OrganizationCreateArgs['data'] = {
        name: orgName,
      }
      const reportingPeriod = await db.reportingPeriod.findFirst({
        where: { name: reportingPeriodName },
      })
      if (!reportingPeriod) {
        logger.error(
          `Reporting period ${reportingPeriodName} does not exist. Cannot create organization.`
        )
        return
      }
      data.preferences = {
        current_reporting_period_id: reportingPeriod.id,
      }
      orgRecord = await db.organization.create({
        data,
      })
    }
    return orgRecord
  } catch (error) {
    logger.error(error, `Error getting or creating organization: ${orgName}`)
  }
}

export const createOrganizationAgencyAdmin: MutationResolvers['createOrganizationAgencyAdmin'] =
  async ({ input }) => {
    const {
      organizationName,
      agencyName,
      agencyAbbreviation,
      agencyCode,
      userEmail,
      userName,
    } = input

    // Create a new organization
    const organization = await db.organization.create({
      data: {
        name: organizationName,
      },
    })

    // Create a new agency associated with the organization
    const agency = await db.agency.create({
      data: {
        name: agencyName,
        abbreviation: agencyAbbreviation,
        organizationId: organization.id,
        code: agencyCode,
      },
    })

    // Create a new user (admin) that belongs to the agency and organization
    const user = await db.user.create({
      data: {
        email: userEmail,
        name: userName,
        agencyId: agency.id,
        organizationId: organization.id,
        role: 'ORGANIZATION_ADMIN',
      },
    })

    return { organization, agency, user }
  }

export const updateOrganization: MutationResolvers['updateOrganization'] = ({
  id,
  input,
}) => {
  return db.organization.update({
    data: input,
    where: { id },
  })
}

export const deleteOrganization: MutationResolvers['deleteOrganization'] = ({
  id,
}) => {
  return db.organization.delete({
    where: { id },
  })
}

export const Organization: OrganizationRelationResolvers = {
  agencies: (_obj, { root }) => {
    return db.organization.findUnique({ where: { id: root?.id } }).agencies()
  },
  users: (_obj, { root }) => {
    return db.organization.findUnique({ where: { id: root?.id } }).users()
  },
  reportingPeriods: (_obj, { root }) => {
    return db.organization
      .findUnique({ where: { id: root?.id } })
      .reportingPeriods()
  },
  uploads: (_obj, { root }) => {
    return db.organization.findUnique({ where: { id: root?.id } }).uploads()
  },
  uploadValidations: (_obj, { root }) => {
    return db.organization
      .findUnique({ where: { id: root?.id } })
      .uploadValidations()
  },
  subrecipients: (_obj, { root }) => {
    return db.organization
      .findUnique({ where: { id: root?.id } })
      .subrecipients()
  },
  projects: (_obj, { root }) => {
    return db.organization.findUnique({ where: { id: root?.id } }).projects()
  },
}

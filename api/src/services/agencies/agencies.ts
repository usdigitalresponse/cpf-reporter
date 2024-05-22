import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

export const agencies: QueryResolvers['agencies'] = () => {
  return db.agency.findMany()
}

export const agency: QueryResolvers['agency'] = ({ id }) => {
  return db.agency.findUnique({
    where: { id },
  })
}

export const createAgency: MutationResolvers['createAgency'] = ({ input }) => {
  return db.agency.create({
    data: input,
  })
}

export const updateAgency: MutationResolvers['updateAgency'] = ({
  id,
  input,
}) => {
  return db.agency.update({
    data: input,
    where: { id },
  })
}

export const deleteAgency: MutationResolvers['deleteAgency'] = ({ id }) => {
  return db.agency.delete({
    where: { id },
  })
}

export const getOrCreateAgencies = async (orgName, agencyData) => {
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
    const agencies = []
    /*
    {
      name: 'Sample Name',
      abbreviation: SAMPLEABBR,
      code: SAMPLECODE,
    }
    */
    const organization = await db.organization.findFirst({
      where: { name: orgName },
    })
    for (const agency of agencyData) {
      try {
        logger.info(`Processing agency ${agency.name}`)
        const existingAgency = await db.agency.findFirst({
          where: { name: agency.name, organizationId: organization.id },
        })
        if (existingAgency) {
          logger.info(
            `${agency.name} exists for organization ${organization.name}`
          )
          agencies.push(existingAgency)
        } else {
          logger.info(`Creating ${agency.name}`)
          agency.organizationId = organization.id
          const newAgency = await db.agency.create({ data: agency })
          agencies.push(newAgency)
        }
      } catch (error) {
        logger.error(error, `Error processing agency ${agency.name}`)
        continue
      }
    }
    logger.info(`Agencies processed: ${agencies.length}`)
    return agencies
  } catch (error) {
    logger.error(error, `Error getting or creating agencies for organization ${orgName}`)
  }
}

export const agenciesByOrganization: QueryResolvers['agenciesByOrganization'] =
  async ({ organizationId }) => {
    try {
      const agencies = await db.agency.findMany({
        where: { organizationId },
      })
      return agencies || [] // Return an empty array if null is received
    } catch (error) {
      console.error(error)
      // Handle the error appropriately; maybe log it and return an empty array
      return []
    }
  }

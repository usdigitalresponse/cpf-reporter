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

export const getOrCreateAgencies = async (organization, agencyData) => {
  const agencies = []
  /*
  {
    name: 'Sample Name',
    abbreviation: SAMPLEABBR,
    code: SAMPLECODE,
  }
  */
  for (const agency of agencyData) {
    try {
      logger.info(`Processing agency ${agency.name}`)
      const existingAgency = await db.agency.findFirst({
        where: { name: agency.name, organizationId: organization.id }
      })
      if (existingAgency) {
        logger.info(`${agency.name} exists for organization ${organization.name}`)
        agencies.push(existingAgency)
      } else {
        logger.info(`Creating ${agency.name}`)
        agency.organizationId = organization.id
        const newAgency = await db.agency.create({ data: agency })
        agencies.push(newAgency)
      }
    } catch (error) {
      logger.error(`Error processing agency ${agency.name}`)
      logger.error(error)
      continue
    }
  }
  logger.info(`Agencies processed: ${agencies.length}`)
  return agencies
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

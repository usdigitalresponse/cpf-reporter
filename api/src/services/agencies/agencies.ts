import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

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

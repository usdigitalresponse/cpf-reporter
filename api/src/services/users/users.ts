import type {
  QueryResolvers,
  MutationResolvers,
  UserRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const users: QueryResolvers['users'] = () => {
  return db.user.findMany()
}

export const user: QueryResolvers['user'] = ({ id }) => {
  return db.user.findUnique({
    where: { id },
  })
}

export const createUser: MutationResolvers['createUser'] = async ({
  input,
}) => {
  const { agencyId } = input

  try {
    const organizationId = (
      await db.agency.findUnique({
        where: { id: agencyId },
      })
    ).organizationId

    return db.user.create({
      data: { ...input, organizationId: organizationId },
    })
  } catch (err) {
    throw new Error(err)
  }
}

export const updateUser: MutationResolvers['updateUser'] = ({ id, input }) => {
  return db.user.update({
    data: input,
    where: { id },
  })
}

export const deleteUser: MutationResolvers['deleteUser'] = ({ id }) => {
  return db.user.delete({
    where: { id },
  })
}

export const usersByOrganization: QueryResolvers['usersByOrganization'] =
  async ({ organizationId }) => {
    try {
      const users = await db.user.findMany({
        where: { organizationId },
      })
      return users || [] // Return an empty array if null is received
    } catch (error) {
      console.error(error)
      // Handle the error appropriately; maybe log it and return an empty array
      return []
    }
  }

export const agenciesUnderCurrentUserOrganization: QueryResolvers['agenciesUnderCurrentUserOrganization'] =
  async ({ organizationId }) => {
    try {
      const agencies = await db.agency.findMany({
        where: { organizationId: organizationId },
      })
      return agencies || [] // Return an empty array if null is received
    } catch (error) {
      console.error(error)
      // Handle the error appropriately; maybe log it and return an empty array
      return []
    }
  }

export const User: UserRelationResolvers = {
  agency: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).agency()
  },
  organization: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).organization()
  },
  certified: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).certified()
  },
  uploaded: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).uploaded()
  },
  validated: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).validated()
  },
  invalidated: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).invalidated()
  },
}

import type {
  QueryResolvers,
  MutationResolvers,
  UserRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'
import { AuthenticationError } from '@redwoodjs/graphql-server'
import { ROLES } from 'src/lib/constants'

export const users: QueryResolvers['users'] = () => {
  return db.user.findMany()
}

export const user: QueryResolvers['user'] = ({ id }) => {
  return db.user.findUnique({
    where: { id },
  })
}

/**
 * Determines if the current user can create a new user with the specified role.
 * - USDR_ADMIN can create users with any role.
 * - ORGANIZATION_ADMIN can create users with roles ORGANIZATION_STAFF or ORGANIZATION_ADMIN.
 * - ORGANIZATION_STAFF can't create users.
 * 
 * @param {Object} currentUser - The current user object.
 * @param {string} userRoleToCreate - The role of the user to be created.
 * @returns {boolean} True if the user can create the new user, false otherwise.
 */
const canCreateUser = (currentUser, userRoleToCreate: string) => {
  const { USDR_ADMIN, ORGANIZATION_ADMIN, ORGANIZATION_STAFF } = ROLES;

  if (currentUser.roles?.includes(USDR_ADMIN)) {
    return true
  }

  if (currentUser.roles?.includes(ORGANIZATION_ADMIN )) {
    return userRoleToCreate === ORGANIZATION_STAFF || userRoleToCreate === ORGANIZATION_ADMIN 
  }

  return false
}

export const createUser: MutationResolvers['createUser'] = async ({input}, {context}) => {
  if (!canCreateUser(context.currentUser, input.role)) {
    throw new AuthenticationError("You don't have permission to do that.")
  }

  const { agencyId } = input

  try {
    const organizationId = (
      await db.agency.findUnique({
        where: { id: agencyId },
      })
    ).organizationId

    return db.user.create({
      data: { ...input, organizationId },
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

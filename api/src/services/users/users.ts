import type {
  QueryResolvers,
  MutationResolvers,
  UserRelationResolvers,
} from 'types/graphql'

import { validate, validateWith, validateUniqueness } from '@redwoodjs/api'

import { AuthenticationError } from '@redwoodjs/graphql-server'
import { ROLES } from 'src/lib/constants'

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
  const { email, name, agencyId } = input
  const { currentUser } = context
  const { USDR_ADMIN } = ROLES

  validate(email, {
    email: { message: 'Please provide a valid email address' },
  })

  validate(name, {
    presence: { allowEmptyString: false, message: 'Please provide a name' },
  })

  validateWith(async () => {
    if (currentUser.roles?.includes(USDR_ADMIN)) {
      return true
    }

    const newUserAgency = await db.agency.findUniqueOrThrow({
      where: { id: agencyId },
      select: { organizationId: true },
    })
    const loggedInUserAgency = await db.agency.findUniqueOrThrow({
      where: { id: currentUser.agencyId as number },
      select: { organizationId: true },
    })

    if (newUserAgency.organizationId !== loggedInUserAgency.organizationId) {
      throw new AuthenticationError("You don't have permission to do that")
    }
  })

  return validateUniqueness(
    'user',
    { email },
    { message: 'This email is already in use' },
    (db) => db.user.create({ data: input })
  )
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
  certified: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).certified()
  },
  uploaded: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).uploaded()
  },
}

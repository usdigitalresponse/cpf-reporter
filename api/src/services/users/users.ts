import type {
  QueryResolvers,
  MutationResolvers,
  UserRelationResolvers,
  Agency,
} from 'types/graphql'

import {
  validate,
  validateWith,
  validateUniqueness,
  validateWithSync,
} from '@redwoodjs/api'
import { AuthenticationError } from '@redwoodjs/graphql-server'

import { ROLES } from 'src/lib/constants'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

export const currentUserIsUSDRAdmin = (): boolean => {
  return context.currentUser?.roles?.includes(ROLES.USDR_ADMIN)
}

/***
 * Validations for create and update actions that are based on user input (e.g. field presence, email validation, etc)
 */
export const runGeneralCreateOrUpdateValidations = async (input) => {
  const { email, name, role, agencyId } = input

  validate(email, {
    email: { message: 'Please provide a valid email address' },
  })

  validate(name, {
    presence: { allowEmptyString: false, message: 'Please provide a name' },
  })

  validate(role, {
    presence: { allowEmptyString: false, message: 'Please provide a role' },
    inclusion: {
      in: Object.values(ROLES),
      message: 'Please select a recognized role',
    },
  })

  await validateWith(async () => {
    await db.agency.findUniqueOrThrow({
      where: { id: agencyId },
      select: { organizationId: true },
    })
  })
}

/**
 *
 * @param input Validations for create and update actions that are based on user permissions (eg logged in user role, agency, etc.)
 */
export const runPermissionsCreateOrUpdateValidations = async (input) => {
  // If current user is a USDR admin, we don't care about any other permissions checks
  if (currentUserIsUSDRAdmin()) {
    return
  }

  const { agencyId, role } = input
  const { currentUser } = context

  validateWithSync(() => {
    if (!currentUser?.roles?.includes(ROLES.ORGANIZATION_ADMIN))
      throw new AuthenticationError("You don't have permission to do that")
  })

  validate(role, {
    exclusion: {
      in: [ROLES.USDR_ADMIN],
      message: "You don't have permission to update that role",
    },
  })

  // User can only create or update a user in the same organization
  await validateWith(async () => {
    const targetUserOrgId = (
      await db.agency.findUniqueOrThrow({
        where: { id: agencyId },
        select: { organizationId: true },
      })
    ).organizationId
    if (targetUserOrgId !== (currentUser.agency as Agency)?.organizationId) {
      throw new AuthenticationError("You don't have permission to do that")
    }
  })
}

/**
 * Validations specific to updating a user
 */
export const runUpdateSpecificValidations = async (input, id) => {
  // If not USDR admin, changes to agencyId are only allowed if the new agency ID is in the same organization
  // as the user's current agency (e.g., you can't swap a user between organizations)
  await validateWith(async () => {
    if (!currentUserIsUSDRAdmin()) {
      const currentAgency = (
        await db.user.findUniqueOrThrow({
          where: { id },
          select: {
            agency: {
              select: { id: true, organizationId: true },
            },
          },
        })
      ).agency

      if (input.agencyId === currentAgency.id) {
        return
      }

      try {
        await db.agency.findUniqueOrThrow({
          where: {
            id: input.agencyId,
            organizationId: currentAgency.organizationId,
          },
        })
      } catch (err) {
        logger.error({ err }, 'change to user.agencyId is not allowed')
        throw new Error('agencyId is invalid or unavailable to this user')
      }
    }
  })
}

export const users: QueryResolvers['users'] = () => {
  if (currentUserIsUSDRAdmin()) {
    return db.user.findMany()
  }

  const userAgency = context.currentUser.agency as Agency
  validate(userAgency.organizationId, {
    presence: {
      message: 'User is not registered to an organization',
    },
  })

  return db.user.findMany({
    where: {
      agency: {
        organizationId: userAgency.organizationId,
      },
    },
  })
}

export const user: QueryResolvers['user'] = ({ id }) => {
  if (currentUserIsUSDRAdmin()) {
    return db.user.findUnique({
      where: { id },
    })
  }

  const userAgency = context.currentUser.agency as Agency
  validate(userAgency.organizationId, {
    presence: {
      message: 'User is not registered to an organization',
    },
  })
  return db.user.findUnique({
    where: {
      id,
      AND: {
        agency: {
          organizationId: userAgency.organizationId,
        },
      },
    },
  })
}

export const createUser: MutationResolvers['createUser'] = async ({
  input,
}) => {
  const { email } = input

  await runGeneralCreateOrUpdateValidations(input)
  await runPermissionsCreateOrUpdateValidations(input)

  return validateUniqueness(
    'user',
    { email },
    { message: 'This email is already in use' },
    (db) => db.user.create({ data: input })
  )
}

export const updateUser: MutationResolvers['updateUser'] = async ({
  id,
  input,
}) => {
  await runGeneralCreateOrUpdateValidations(input)
  await runPermissionsCreateOrUpdateValidations(input)
  await runUpdateSpecificValidations(input, id)

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
    let users = []
    try {
      if (
        currentUserIsUSDRAdmin() ||
        organizationId === (context.currentUser.agency as Agency).organizationId
      )
        users = await db.user.findMany({
          where: { agency: { organizationId } },
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

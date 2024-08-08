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
import { createPassageUser } from 'src/services/passage/passage'

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
    if (currentUser?.roles?.includes(ROLES.ORGANIZATION_STAFF))
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
    { message: 'This email is already in use', db: db },
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

export const getOrCreateUsers = async (users, orgName) => {
  // This function is used to create initial expenditure categories
  // It is intended to only be called via the `onboardOrganization` script
  // Hence, we hard-return if we detect a non-empty context
  if (context && Object.keys(context).length > 0) {
    logger.error(
      { custom: context },
      `This function is intended to be called via the onboardOrganization script and not via GraphQL API. Skipping...`
    )
    return
  }

  try {
    /*
    Users are sent in the following Array format
    {
      name: 'Sample Name',
      email: 'sample@example.com',
      role: 'ORGANIZATION_STAFF',
      agencyName: 'Sample Name',
      passageId: '1234', // Optional
    }
    */
    const organization = await db.organization.findFirst({
      where: { name: orgName },
    })
    if (!organization) {
      logger.error(`Organization ${orgName} not found`)
      return
    }
    const orgAgencies = await db.agency.findMany({
      where: { organizationId: organization.id },
    })
    const agenciesByName = {}
    for (const agency of orgAgencies) {
      agenciesByName[agency.name] = agency
    }
    const userRecords = []
    for (const user of users) {
      try {
        logger.info(`Processing user ${user.email}`)
        if (!agenciesByName[user.agencyName]) {
          logger.error(
            `Agency ${user.agencyName} not found for organization ${organization.name}`
          )
          continue
        }
        const userData: Prisma.UserCreateArgs['data'] = {
          email: user.email,
          name: user.name,
          agencyId: agenciesByName[user.agencyName].id,
          role: user.role,
          isActive: true,
        }
        const existingUser = await db.user.findFirst({
          where: { email: userData.email },
        })
        if (existingUser) {
          logger.info(`User ${userData.email} already exists`)
          userRecords.push(existingUser)
          continue
        } else {
          if (process.env.AUTH_PROVIDER === 'passage' && !userData.passageId) {
            logger.info(`Creating Passage user for ${userData.email}`)
            const passageUser = await createPassageUser(userData.email)
            userData.passageId = passageUser.id
          }
          const record = await db.user.create({ data: userData })
          logger.info(`User ${userData.email} created`)
          logger.info(record)
          userRecords.push(record)
        }
      } catch (error) {
        logger.error(error, `Error processing user ${user.email}`)
        continue
      }
    }
    return userRecords
  } catch (error) {
    logger.error(
      error,
      `Error getting or creating users for organization ${orgName}`
    )
  }
}

export const User: UserRelationResolvers = {
  agency: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).agency()
  },
  uploaded: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).uploaded()
  },
}

import type {
  QueryResolvers,
  MutationResolvers,
  OrganizationRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

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
}

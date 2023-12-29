export const schema = gql`
  type Organization {
    id: Int!
    agencies: [Agency]!
    name: String!
  }

  type Query {
    organizations: [Organization!]! @requireAuth
    organization(id: Int!): Organization @requireAuth
  }

  input CreateOrganizationInput {
    name: String!
  }

  input UpdateOrganizationInput {
    name: String
  }

  type Mutation {
    createOrganization(input: CreateOrganizationInput!): Organization!
      @requireAuth
    updateOrganization(
      id: Int!
      input: UpdateOrganizationInput!
    ): Organization! @requireAuth
    deleteOrganization(id: Int!): Organization! @requireAuth
    createOrganizationAgencyAdmin(
      input: CreateOrgAgencyAdminInput!
    ): CreateOrgAgencyAdminPayload @requireAuth
  }

  input CreateOrgAgencyAdminInput {
    organizationName: String!
    agencyName: String!
    agencyAbbreviation: String!
    agencyCode: String!
    userEmail: String!
    userName: String!
  }

  type CreateOrgAgencyAdminPayload {
    organization: Organization
    agency: Agency
    user: User
  }
`

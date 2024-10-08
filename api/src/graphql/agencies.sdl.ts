export const schema = gql`
  type Agency {
    id: Int!
    name: String!
    abbreviation: String
    code: String!
    organizationId: Int!
  }

  type Query {
    agencies: [Agency!]! @requireAuth
    agency(id: Int!): Agency @requireAuth
    agenciesByOrganization(organizationId: Int!): [Agency!]! @requireAuth
    agenciesAvailableForUpload: [Agency!]! @requireAuth
  }

  input CreateAgencyInput {
    name: String!
    abbreviation: String
    code: String!
    organizationId: Int!
  }

  input UpdateAgencyInput {
    name: String
    abbreviation: String
    code: String
    organizationId: Int!
  }

  type Mutation {
    createAgency(input: CreateAgencyInput!): Agency!
      @requireAuth(roles: ["USDR_ADMIN", "ORGANIZATION_ADMIN"])
    updateAgency(id: Int!, input: UpdateAgencyInput!): Agency!
      @requireAuth(roles: ["USDR_ADMIN", "ORGANIZATION_ADMIN"])
    deleteAgency(id: Int!): Agency! @requireAuth
  }
`

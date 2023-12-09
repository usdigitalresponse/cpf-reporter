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
  }

  input CreateAgencyInput {
    name: String!
    abbreviation: String
    code: String!
  }

  input UpdateAgencyInput {
    name: String
    abbreviation: String
    code: String
  }

  type Mutation {
    createAgency(input: CreateAgencyInput!): Agency! @requireAuth
    updateAgency(id: Int!, input: UpdateAgencyInput!): Agency! @requireAuth
    deleteAgency(id: Int!): Agency! @requireAuth
  }
`

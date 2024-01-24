export const schema = gql`
  enum RoleEnum {
    USDR_ADMIN
    ORGANIZATION_ADMIN
    ORGANIZATION_STAFF
  }

  type User {
    id: Int!
    email: String!
    name: String
    agencyId: Int
    organizationId: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    agency: Agency
    organization: Organization!
    role: RoleEnum
    certified: [ReportingPeriod]!
    uploaded: [Upload]!
    validated: [UploadValidation]!
    invalidated: [UploadValidation]!
  }

  type Query {
    users: [User!]! @requireAuth
    usersByOrganization(organizationId: Int!): [User!]! @requireAuth
    user(id: Int!): User @requireAuth
    agenciesUnderCurrentUserOrganization(organizationId: Int!): [Agency!]
      @requireAuth
  }

  input CreateUserInput {
    email: String!
    name: String
    agencyId: Int
    organizationId: Int
    role: String
  }

  input UpdateUserInput {
    email: String
    name: String
    agencyId: Int
    organizationId: Int
    role: String
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: Int!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: Int!): User! @requireAuth
  }
`

export const schema = gql`
  enum RoleEnum {
    USDR_ADMIN
    ORGANIZATION_ADMIN
    ORGANIZATION_STAFF
  }

  type User {
    id: Int!
    email: String!
    name: String!
    agencyId: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    agency: Agency!
    role: RoleEnum!
    isActive: Boolean!
    passageId: String
    uploaded: [Upload]!
    certifiedReportingPeriods: [ReportingPeriodCertification]!
  }

  type Query {
    users: [User!]! @requireAuth
    usersByOrganization(organizationId: Int!): [User!]! @requireAuth
    user(id: Int!): User @requireAuth
  }

  input CreateUserInput {
    email: String!
    name: String!
    agencyId: Int!
    role: RoleEnum!
    isActive: Boolean
  }

  input UpdateUserInput {
    email: String
    name: String
    agencyId: Int
    role: RoleEnum
    isActive: Boolean
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
      @requireAuth(roles: ["USDR_ADMIN", "ORGANIZATION_ADMIN"])
    updateUser(id: Int!, input: UpdateUserInput!): User!
      @requireAuth(roles: ["USDR_ADMIN", "ORGANIZATION_ADMIN"])
    deleteUser(id: Int!): User! @requireAuth
  }
`

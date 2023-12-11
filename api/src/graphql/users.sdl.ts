export const schema = gql`
  type User {
    id: Int!
    email: String!
    name: String
    agencyId: Int
    organizationId: Int!
    roleId: Int
    createdAt: DateTime!
    updatedAt: DateTime!
    agency: Agency
    organization: Organization!
    role: Role
    certified: [ReportingPeriod]!
    uploaded: [Upload]!
    validated: [UploadValidation]!
    invalidated: [UploadValidation]!
  }

  type Query {
    users: [User!]! @requireAuth
    user(id: Int!): User @requireAuth
  }

  input CreateUserInput {
    email: String!
    name: String
    agencyId: Int
    organizationId: Int!
    roleId: Int
  }

  input UpdateUserInput {
    email: String
    name: String
    agencyId: Int
    organizationId: Int
    roleId: Int
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: Int!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: Int!): User! @requireAuth
  }
`

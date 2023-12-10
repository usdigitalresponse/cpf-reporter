export const schema = gql`
  type Project {
    id: Int!
    code: String!
    name: String!
    agencyId: Int!
    agency: Agency!
    organizationId: Int!
    organization: Organization!
    status: String!
    description: String!
    originationPeriodId: Int!
    originationPeriod: ReportingPeriod!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    projects: [Project!]! @requireAuth
    project(id: Int!): Project @requireAuth
  }

  input CreateProjectInput {
    code: String!
    name: String!
    agencyId: Int!
    organizationId: Int!
    status: String!
    description: String!
    originationPeriodId: Int!
  }

  input UpdateProjectInput {
    code: String
    name: String
    agencyId: Int
    organizationId: Int
    status: String
    description: String
    originationPeriodId: Int
  }

  type Mutation {
    createProject(input: CreateProjectInput!): Project! @requireAuth
    updateProject(id: Int!, input: UpdateProjectInput!): Project! @requireAuth
    deleteProject(id: Int!): Project! @requireAuth
  }
`

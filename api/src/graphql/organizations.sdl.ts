export const schema = gql`
  type Organization {
    id: Int!
    agencies: [Agency]!
    users: [User]!
    name: String!
    reportingPeriods: [ReportingPeriod]!
    uploads: [Upload]!
    uploadValidations: [UploadValidation]!
    subrecipients: [Subrecipient]!
    projects: [Project]!
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
  }
`

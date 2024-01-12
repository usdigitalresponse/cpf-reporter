export const schema = gql`
  type ReportingPeriod {
    id: Int!
    name: String!
    startDate: DateTime!
    endDate: DateTime!
    organizationId: Int!
    organization: Organization!
    certifiedAt: DateTime
    certifiedById: Int
    certifiedBy: User
    inputTemplateId: Int!
    inputTemplate: InputTemplate!
    outputTemplateId: Int!
    outputTemplate: OutputTemplate!
    isCurrentPeriod: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    uploads: [Upload]!
    projects: [Project]!
  }

  type Query {
    reportingPeriods: [ReportingPeriod!]! @requireAuth
    reportingPeriod(id: Int!): ReportingPeriod @requireAuth
  }

  input CreateReportingPeriodInput {
    name: String!
    startDate: DateTime!
    endDate: DateTime!
    organizationId: Int!
    certifiedAt: DateTime
    certifiedById: Int
    inputTemplateId: Int!
    outputTemplateId: Int!
    isCurrentPeriod: Boolean!
  }

  input UpdateReportingPeriodInput {
    name: String
    startDate: DateTime
    endDate: DateTime
    organizationId: Int
    certifiedAt: DateTime
    certifiedById: Int
    inputTemplateId: Int
    outputTemplateId: Int
    isCurrentPeriod: Boolean
  }

  type Mutation {
    createReportingPeriod(input: CreateReportingPeriodInput!): ReportingPeriod!
      @requireAuth
    updateReportingPeriod(
      id: Int!
      input: UpdateReportingPeriodInput!
    ): ReportingPeriod! @requireAuth
    deleteReportingPeriod(id: Int!): ReportingPeriod! @requireAuth
  }
`

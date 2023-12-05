export const schema = gql`
  type ReportingPeriod {
    id: Int!
    name: String!
    startDate: DateTime!
    endDate: DateTime!
    certifiedAt: DateTime
    inputTemplateId: Int!
    inputTemplate: InputTemplate!
    outputTemplateId: Int!
    outputTemplate: OutputTemplate!
    isCurrentPeriod: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    reportingPeriods: [ReportingPeriod!]! @requireAuth
    reportingPeriod(id: Int!): ReportingPeriod @requireAuth
  }

  input CreateReportingPeriodInput {
    name: String!
    startDate: DateTime!
    endDate: DateTime!
    certifiedAt: DateTime
    inputTemplateId: Int!
    outputTemplateId: Int!
    isCurrentPeriod: Boolean!
  }

  input UpdateReportingPeriodInput {
    name: String
    startDate: DateTime
    endDate: DateTime
    certifiedAt: DateTime
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

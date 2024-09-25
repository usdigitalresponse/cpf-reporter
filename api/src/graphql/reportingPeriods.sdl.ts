export const schema = gql`
  type ReportingPeriod {
    id: Int!
    name: String!
    startDate: DateTime!
    endDate: DateTime!
    inputTemplateId: Int!
    inputTemplate: InputTemplate!
    outputTemplateId: Int!
    outputTemplate: OutputTemplate!
    createdAt: DateTime!
    updatedAt: DateTime!
    uploads: [Upload]!
    projects: [Project]!
    validationRulesId: Int
    validationRules: ValidationRules
    certifications: [ReportingPeriodCertification]!
  }

  type Query {
    reportingPeriods: [ReportingPeriod!]! @requireAuth
    reportingPeriod(id: Int!): ReportingPeriod @requireAuth
  }

  input CreateReportingPeriodInput {
    name: String!
    startDate: DateTime!
    endDate: DateTime!
    inputTemplateId: Int!
    outputTemplateId: Int!
  }

  input UpdateReportingPeriodInput {
    name: String
    startDate: DateTime
    endDate: DateTime
    inputTemplateId: Int
    outputTemplateId: Int
  }

  type Mutation {
    createReportingPeriod(input: CreateReportingPeriodInput!): ReportingPeriod!
      @requireAuth
    certifyReportingPeriodAndOpenNextPeriod(
      reportingPeriodId: Int!
    ): ReportingPeriod @requireAuth(roles: ["USDR_ADMIN", "ORGANIZATION_ADMIN"])
    updateReportingPeriod(
      id: Int!
      input: UpdateReportingPeriodInput!
    ): ReportingPeriod! @requireAuth
    deleteReportingPeriod(id: Int!): ReportingPeriod! @requireAuth
  }
`

export const schema = gql`
  type ReportingPeriodCertification {
    id: Int!
    organizationId: Int!
    organization: Organization!
    reportingPeriodId: Int!
    reportingPeriod: ReportingPeriod!
    certifiedById: Int!
    certifiedBy: User!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    reportingPeriodCertifications: [ReportingPeriodCertification!]! @requireAuth
    reportingPeriodCertification(id: Int!): ReportingPeriodCertification
      @requireAuth
  }

  input CreateReportingPeriodCertificationInput {
    organizationId: Int!
    reportingPeriodId: Int!
    certifiedById: Int!
  }

  input UpdateReportingPeriodCertificationInput {
    organizationId: Int
    reportingPeriodId: Int
    certifiedById: Int
  }

  type Mutation {
    createReportingPeriodCertification(
      input: CreateReportingPeriodCertificationInput!
    ): ReportingPeriodCertification! @requireAuth
    updateReportingPeriodCertification(
      id: Int!
      input: UpdateReportingPeriodCertificationInput!
    ): ReportingPeriodCertification! @requireAuth
    deleteReportingPeriodCertification(id: Int!): ReportingPeriodCertification!
  }
`

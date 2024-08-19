export const schema = gql`
  type OutputTemplate {
    id: Int!
    name: String!
    version: String!
    effectiveDate: DateTime!
    rulesGeneratedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
    reportingPeriods: [ReportingPeriod]!
  }

  type Query {
    outputTemplates: [OutputTemplate!]! @requireAuth
    outputTemplate(id: Int!): OutputTemplate @requireAuth
  }

  input CreateOutputTemplateInput {
    name: String!
    version: String!
    effectiveDate: DateTime!
    rulesGeneratedAt: DateTime
  }

  input UpdateOutputTemplateInput {
    name: String
    version: String
    effectiveDate: DateTime
    rulesGeneratedAt: DateTime
  }

  type Mutation {
    createOutputTemplate(input: CreateOutputTemplateInput!): OutputTemplate!
      @requireAuth
    updateOutputTemplate(
      id: Int!
      input: UpdateOutputTemplateInput!
    ): OutputTemplate! @requireAuth
    deleteOutputTemplate(id: Int!): OutputTemplate! @requireAuth
  }
`

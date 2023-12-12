export const schema = gql`
  type InputTemplate {
    id: Int!
    name: String!
    version: String!
    effectiveDate: DateTime!
    rulesGeneratedAt: DateTime!
    createdAt: DateTime!
    updatedAt: DateTime!
    reportingPeriods: [ReportingPeriod]!
  }

  type Query {
    inputTemplates: [InputTemplate!]! @requireAuth
    inputTemplate(id: Int!): InputTemplate @requireAuth
  }

  input CreateInputTemplateInput {
    name: String!
    version: String!
    effectiveDate: DateTime!
    rulesGeneratedAt: DateTime!
  }

  input UpdateInputTemplateInput {
    name: String
    version: String
    effectiveDate: DateTime
    rulesGeneratedAt: DateTime
  }

  type Mutation {
    createInputTemplate(input: CreateInputTemplateInput!): InputTemplate!
      @requireAuth
    updateInputTemplate(
      id: Int!
      input: UpdateInputTemplateInput!
    ): InputTemplate! @requireAuth
    deleteInputTemplate(id: Int!): InputTemplate! @requireAuth
  }
`

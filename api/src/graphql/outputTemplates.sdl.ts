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

  type SignedUrls {
    CPF1A: String
    CPF1B: String
    CPF1C: String
    CPFSubrecipient: String
  }

  type OutputTemplateWithSignedUrl {
    outputTemplate: OutputTemplate!
    signedUrls: SignedUrls!
  }

  type Query {
    outputTemplates: [OutputTemplate!]! @requireAuth
    outputTemplate(id: Int!): OutputTemplate @requireAuth
  }

  input FileNames {
    CPF1A: String
    CPF1B: String
    CPF1C: String
    CPFSubrecipient: String
  }

  input CreateOutputTemplateInput {
    name: String!
    version: String!
    effectiveDate: DateTime!
    rulesGeneratedAt: DateTime
    filenames: FileNames!
  }

  input UpdateOutputTemplateInput {
    name: String
    version: String
    effectiveDate: DateTime
    rulesGeneratedAt: DateTime
  }

  type Mutation {
    createOutputTemplate(
      input: CreateOutputTemplateInput!
    ): OutputTemplateWithSignedUrl! @requireAuth
    updateOutputTemplate(
      id: Int!
      input: UpdateOutputTemplateInput!
    ): OutputTemplate! @requireAuth
    deleteOutputTemplate(id: Int!): OutputTemplate! @requireAuth
  }
`

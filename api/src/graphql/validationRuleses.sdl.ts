export const schema = gql`
  type ValidationRules {
    id: Int!
    versionId: Version!
    createdAt: DateTime!
    updatedAt: DateTime!
    validations: [UploadValidation]!
    reportingPeriods: [ReportingPeriod]!
  }

  enum Version {
    V2023_12_12
    V2024_01_07
    V2024_04_01
  }

  type Query {
    validationRuleses: [ValidationRules!]! @requireAuth
    validationRules(id: Int!): ValidationRules @requireAuth
  }

  input CreateValidationRulesInput {
    versionId: Version!
  }

  input UpdateValidationRulesInput {
    versionId: Version
  }

  type Mutation {
    createValidationRules(input: CreateValidationRulesInput!): ValidationRules!
      @requireAuth
    updateValidationRules(
      id: Int!
      input: UpdateValidationRulesInput!
    ): ValidationRules! @requireAuth
    deleteValidationRules(id: Int!): ValidationRules! @requireAuth
  }
`

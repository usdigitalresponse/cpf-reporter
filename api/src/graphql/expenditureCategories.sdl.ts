export const schema = gql`
  type ExpenditureCategory {
    id: Int!
    name: String!
    code: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    Uploads: [Upload]!
  }

  type Query {
    expenditureCategories: [ExpenditureCategory!]! @requireAuth
    expenditureCategory(id: Int!): ExpenditureCategory @requireAuth
  }

  input CreateExpenditureCategoryInput {
    name: String!
    code: String!
  }

  input UpdateExpenditureCategoryInput {
    name: String
    code: String
  }

  type Mutation {
    createExpenditureCategory(
      input: CreateExpenditureCategoryInput!
    ): ExpenditureCategory! @requireAuth
    updateExpenditureCategory(
      id: Int!
      input: UpdateExpenditureCategoryInput!
    ): ExpenditureCategory! @requireAuth
    deleteExpenditureCategory(id: Int!): ExpenditureCategory! @requireAuth
  }
`

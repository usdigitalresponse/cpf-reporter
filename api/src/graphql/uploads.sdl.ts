export const schema = gql`
  type Upload {
    id: Int!
    filename: String!
    uploadedById: Int!
    uploadedBy: User!
    agencyId: Int!
    agency: Agency!
    organizationId: Int!
    organizaiton: Organization!
    reportingPeriodId: Int!
    reportingPeriod: ReportingPeriod!
    expenditureCategoryId: Int!
    expenditureCategory: ExpenditureCategory!
    createdAt: DateTime!
    updatedAt: DateTime!
    validations: [UploadValidation]!
  }

  type Query {
    uploads: [Upload!]! @requireAuth
    upload(id: Int!): Upload @requireAuth
  }

  input CreateUploadInput {
    filename: String!
    uploadedById: Int!
    agencyId: Int!
    organizationId: Int!
    reportingPeriodId: Int!
    expenditureCategoryId: Int!
  }

  input UpdateUploadInput {
    filename: String
    uploadedById: Int
    agencyId: Int
    organizationId: Int
    reportingPeriodId: Int
    expenditureCategoryId: Int
  }

  type Mutation {
    createUpload(input: CreateUploadInput!): Upload! @requireAuth
    updateUpload(id: Int!, input: UpdateUploadInput!): Upload! @requireAuth
    deleteUpload(id: Int!): Upload! @requireAuth
  }
`

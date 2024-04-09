export const schema = gql`
  type Upload {
    id: Int!
    filename: String!
    uploadedById: Int!
    uploadedBy: User!
    agencyId: Int!
    agency: Agency!
    reportingPeriodId: Int!
    reportingPeriod: ReportingPeriod!
    expenditureCategoryId: Int
    expenditureCategory: ExpenditureCategory
    createdAt: DateTime!
    updatedAt: DateTime!
    validations: [UploadValidation]!
    signedUrl: String
    latestValidation: UploadValidation
  }

  type Query {
    uploads: [Upload!]! @requireAuth
    upload(id: Int!): Upload @requireAuth
  }

  input CreateUploadInput {
    filename: String!
    uploadedById: Int!
    agencyId: Int!
    reportingPeriodId: Int!
    expenditureCategoryId: Int
  }

  input UpdateUploadInput {
    filename: String
    uploadedById: Int
    agencyId: Int
    reportingPeriodId: Int
    expenditureCategoryId: Int
  }

  type Mutation {
    createUpload(input: CreateUploadInput!): Upload! @requireAuth
    updateUpload(id: Int!, input: UpdateUploadInput!): Upload! @requireAuth
    deleteUpload(id: Int!): Upload! @requireAuth
    downloadUploadFile(id: Int!): String! @requireAuth
  }
`

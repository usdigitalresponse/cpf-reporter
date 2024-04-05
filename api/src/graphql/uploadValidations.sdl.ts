export const schema = gql`
  type UploadValidation {
    id: Int!
    uploadId: Int!
    upload: Upload!
    results: JSON
    passed: Boolean!
    initiatedById: Int!
    initiatedBy: User!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    uploadValidations: [UploadValidation!]! @requireAuth
    uploadValidation(id: Int!): UploadValidation @requireAuth
  }

  input CreateUploadValidationInput {
    uploadId: Int!
    results: JSON
    passed: Boolean!
    initiatedById: Int!
  }

  input UpdateUploadValidationInput {
    uploadId: Int
    results: JSON
    passed: Boolean
    initiatedById: Int
  }

  type Mutation {
    createUploadValidation(
      input: CreateUploadValidationInput!
    ): UploadValidation! @requireAuth
    updateUploadValidation(
      id: Int!
      input: UpdateUploadValidationInput!
    ): UploadValidation! @requireAuth
    deleteUploadValidation(id: Int!): UploadValidation! @requireAuth
  }
`

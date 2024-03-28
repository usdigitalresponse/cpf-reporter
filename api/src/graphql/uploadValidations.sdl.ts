export const schema = gql`
  type UploadValidation {
    id: Int!
    uploadId: Int!
    upload: Upload!
    results: JSON
    passed: Boolean!
    initiatedById: Int!
    initiatedBy: User!
    validatedAt: DateTime
    invalidationResults: JSON
    invalidatedAt: DateTime
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
    validatedAt: DateTime
    invalidationResults: JSON
    invalidatedAt: DateTime
  }

  input UpdateUploadValidationInput {
    uploadId: Int
    results: JSON
    passed: Boolean
    initiatedById: Int
    validatedAt: DateTime
    invalidationResults: JSON
    invalidatedAt: DateTime
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

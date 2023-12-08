export const schema = gql`
  type UploadValidation {
    id: Int!
    uploadId: Int!
    upload: Upload!
    agencyId: Int!
    agency: Agency!
    organizationId: Int!
    organizaiton: Organization!
    inputTemplateId: Int!
    inputTemplate: InputTemplate!
    validationResults: JSON
    validatedAt: DateTime
    validatedById: Int
    validatedBy: User
    invalidationResults: JSON
    invalidatedAt: DateTime
    invalidatedById: Int
    invalidatedBy: User
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    uploadValidations: [UploadValidation!]! @requireAuth
    uploadValidation(id: Int!): UploadValidation @requireAuth
  }

  input CreateUploadValidationInput {
    uploadId: Int!
    agencyId: Int!
    organizationId: Int!
    inputTemplateId: Int!
    validationResults: JSON
    validatedAt: DateTime
    validatedById: Int
    invalidationResults: JSON
    invalidatedAt: DateTime
    invalidatedById: Int
  }

  input UpdateUploadValidationInput {
    uploadId: Int
    agencyId: Int
    organizationId: Int
    inputTemplateId: Int
    validationResults: JSON
    validatedAt: DateTime
    validatedById: Int
    invalidationResults: JSON
    invalidatedAt: DateTime
    invalidatedById: Int
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

export const schema = gql`
  enum ReviewTypeEnum {
    VALIDATED
    INVALIDATED
  }

  type UploadValidation {
    id: Int!
    uploadId: Int!
    upload: Upload!
    agencyId: Int!
    agency: Agency!
    organizationId: Int!
    organization: Organization!
    inputTemplateId: Int!
    inputTemplate: InputTemplate!
    reviewResults: JSON
    reviewedAt: DateTime
    reviewedById: Int
    reviewedBy: User
    reviewType: ReviewTypeEnum
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
    reviewResults: JSON
  }

  input UpdateUploadValidationInput {
    uploadId: Int
    agencyId: Int
    organizationId: Int
    inputTemplateId: Int
    reviewResults: JSON
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

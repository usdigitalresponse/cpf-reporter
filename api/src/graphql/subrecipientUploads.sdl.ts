export const schema = gql`
  type SubrecipientUpload {
    id: Int!
    subrecipientId: Int!
    subrecipient: Subrecipient!
    uploadId: Int!
    upload: Upload!
    rawSubrecipient: JSON!
    createdAt: DateTime!
    updatedAt: DateTime!
    version: Version!
    parsedSubrecipient: ParsedSubrecipient
  }

  type ParsedSubrecipient {
    name: String!
    recipientId: String!
    pocName: String!
    pocPhoneNumber: String!
    pocEmailAddress: String!
    zip5: String!
    zip4: String!
    addressLine1: String!
    addressLine2: String!
    addressLine3: String!
    city: String!
    state: String!
  }

  enum Version {
    V2023_12_12
    V2024_01_07
    V2024_04_01
    V2024_05_24
  }

  type Query {
    subrecipientUploads: [SubrecipientUpload!]! @requireAuth
    subrecipientUpload(id: Int!): SubrecipientUpload @requireAuth
  }

  input CreateSubrecipientUploadInput {
    subrecipientId: Int!
    rawSubrecipient: JSON!
    version: Version!
    uploadId: Int!
  }

  input UpdateSubrecipientUploadInput {
    subrecipientId: Int
    rawSubrecipient: JSON
    version: Version
  }

  type Mutation {
    createSubrecipientUpload(
      input: CreateSubrecipientUploadInput!
    ): SubrecipientUpload! @requireAuth
    updateSubrecipientUpload(
      id: Int!
      input: UpdateSubrecipientUploadInput!
    ): SubrecipientUpload! @requireAuth
    deleteSubrecipientUpload(id: Int!): SubrecipientUpload! @requireAuth
  }
`

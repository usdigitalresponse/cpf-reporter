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
    ueiTinCombo: String!
    rawSubrecipient: JSON!
    version: Version!
  }

  input UpdateSubrecipientUploadInput {
    subrecipientId: Int
    ueiTinCombo: String
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

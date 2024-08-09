export const schema = gql`
  type Subrecipient {
    id: Int!
    name: String!
    ueiTinCombo: String!
    organizationId: Int!
    organization: Organization!
    createdAt: DateTime!
    updatedAt: DateTime!
    status: SubrecipientStatus
    subrecipientUploads: [SubrecipientUpload]
    latestSubrecipientUpload: SubrecipientUpload
  }

  enum SubrecipientStatus {
    ACTIVE
    ARCHIVED
  }

  type Query {
    subrecipients: [Subrecipient!]! @requireAuth
    subrecipient(id: Int!): Subrecipient @requireAuth
  }

  input CreateSubrecipientInput {
    name: String!
    organizationId: Int!
    ueiTinCombo: String!
  }

  input UpdateSubrecipientInput {
    name: String
    organizationId: Int
  }

  type Mutation {
    createSubrecipient(input: CreateSubrecipientInput!): Subrecipient!
      @requireAuth
    updateSubrecipient(
      id: Int!
      input: UpdateSubrecipientInput!
    ): Subrecipient! @requireAuth
    deleteSubrecipient(id: Int!): Subrecipient! @requireAuth
  }
`

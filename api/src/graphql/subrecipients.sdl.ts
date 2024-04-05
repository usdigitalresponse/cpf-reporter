export const schema = gql`
  type Subrecipient {
    id: Int!
    name: String!
    organizationId: Int!
    organization: Organization!
    startDate: DateTime!
    endDate: DateTime!
    certifiedAt: DateTime
    certifiedById: Int
    certifiedBy: User
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    subrecipients: [Subrecipient!]! @requireAuth
    subrecipient(id: Int!): Subrecipient @requireAuth
  }

  input CreateSubrecipientInput {
    name: String!
    organizationId: Int!
    startDate: DateTime!
    endDate: DateTime!
    certifiedAt: DateTime
    certifiedById: Int
  }

  input UpdateSubrecipientInput {
    name: String
    organizationId: Int
    startDate: DateTime
    endDate: DateTime
    certifiedAt: DateTime
    certifiedById: Int
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

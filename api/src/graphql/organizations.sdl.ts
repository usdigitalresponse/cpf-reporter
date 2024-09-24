export const schema = gql`
  type Organization {
    id: Int!
    agencies: [Agency]!
    users: [User]!
    name: String!
    subrecipients: [Subrecipient]!
    projects: [Project]!
    preferences: JSON
    reportingPeriodCertifications: [ReportingPeriodCertification]!
  }

  type Query {
    organizations: [Organization!]! @requireAuth
    organization(id: Int!): Organization @requireAuth
    organizationOfCurrentUser: Organization @requireAuth
  }

  input CreateOrganizationInput {
    name: String!
  }

  input UpdateOrganizationInput {
    name: String
    preferences: JSON
  }

  input NewTreasuryGenerationInput {
    organizationId: Int
    payload: JSON!
  }

  type TreasuryReportGenerationPayload {
    response: String
  }

  input DownloadTreasuryFileInput {
    fileType: String!
  }

  type TreasuryFilePayload {
    fileLink: String
  }

  type Mutation {
    createOrganization(input: CreateOrganizationInput!): Organization!
      @requireAuth
    updateOrganization(
      id: Int!
      input: UpdateOrganizationInput!
    ): Organization! @requireAuth
    deleteOrganization(id: Int!): Organization! @requireAuth
    createOrganizationAgencyAdmin(
      input: CreateOrgAgencyAdminInput!
    ): CreateOrgAgencyAdminPayload @requireAuth
    kickOffTreasuryReportGeneration(
      input: NewTreasuryGenerationInput!
    ): TreasuryReportGenerationPayload @requireAuth
    downloadTreasuryFile(
      input: DownloadTreasuryFileInput!
    ): TreasuryFilePayload @requireAuth
  }

  input CreateOrgAgencyAdminInput {
    organizationName: String!
    agencyName: String!
    agencyAbbreviation: String!
    agencyCode: String!
    userEmail: String!
    userName: String!
  }

  type CreateOrgAgencyAdminPayload {
    organization: Organization
    agency: Agency
    user: User
  }
`

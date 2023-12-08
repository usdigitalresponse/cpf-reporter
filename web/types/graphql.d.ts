import { Prisma } from "@prisma/client"
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigInt: number;
  Date: string;
  DateTime: string;
  JSON: Prisma.JsonValue;
  JSONObject: Prisma.JsonObject;
  Time: string;
};

export type Agency = {
  __typename?: 'Agency';
  abbreviation?: Maybe<Scalars['String']>;
  code: Scalars['String'];
  id: Scalars['Int'];
  name: Scalars['String'];
  organizationId: Scalars['Int'];
};

export type CreateAgencyInput = {
  abbreviation?: InputMaybe<Scalars['String']>;
  code: Scalars['String'];
  name: Scalars['String'];
};

export type CreateInputTemplateInput = {
  effectiveDate: Scalars['DateTime'];
  name: Scalars['String'];
  rulesGeneratedAt: Scalars['DateTime'];
  version: Scalars['String'];
};

export type CreateOrganizationInput = {
  name: Scalars['String'];
};

export type CreateOutputTemplateInput = {
  effectiveDate: Scalars['DateTime'];
  name: Scalars['String'];
  rulesGeneratedAt: Scalars['DateTime'];
  version: Scalars['String'];
};

export type CreateReportingPeriodInput = {
  certifiedAt?: InputMaybe<Scalars['DateTime']>;
  certifiedById?: InputMaybe<Scalars['Int']>;
  endDate: Scalars['DateTime'];
  inputTemplateId: Scalars['Int'];
  isCurrentPeriod: Scalars['Boolean'];
  name: Scalars['String'];
  outputTemplateId: Scalars['Int'];
  startDate: Scalars['DateTime'];
};

export type CreateRoleInput = {
  name: Scalars['String'];
};

export type CreateUserInput = {
  agencyId?: InputMaybe<Scalars['Int']>;
  email: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  organizationId: Scalars['Int'];
  roleId?: InputMaybe<Scalars['Int']>;
};

export type InputTemplate = {
  __typename?: 'InputTemplate';
  createdAt: Scalars['DateTime'];
  effectiveDate: Scalars['DateTime'];
  id: Scalars['Int'];
  name: Scalars['String'];
  reportingPeriods: Array<Maybe<ReportingPeriod>>;
  rulesGeneratedAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  version: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAgency: Agency;
  createInputTemplate: InputTemplate;
  createOrganization: Organization;
  createOutputTemplate: OutputTemplate;
  createReportingPeriod: ReportingPeriod;
  createRole: Role;
  createUser: User;
  deleteAgency: Agency;
  deleteInputTemplate: InputTemplate;
  deleteOrganization: Organization;
  deleteOutputTemplate: OutputTemplate;
  deleteReportingPeriod: ReportingPeriod;
  deleteRole: Role;
  deleteUser: User;
  updateAgency: Agency;
  updateInputTemplate: InputTemplate;
  updateOrganization: Organization;
  updateOutputTemplate: OutputTemplate;
  updateReportingPeriod: ReportingPeriod;
  updateRole: Role;
  updateUser: User;
};


export type MutationcreateAgencyArgs = {
  input: CreateAgencyInput;
};


export type MutationcreateInputTemplateArgs = {
  input: CreateInputTemplateInput;
};


export type MutationcreateOrganizationArgs = {
  input: CreateOrganizationInput;
};


export type MutationcreateOutputTemplateArgs = {
  input: CreateOutputTemplateInput;
};


export type MutationcreateReportingPeriodArgs = {
  input: CreateReportingPeriodInput;
};


export type MutationcreateRoleArgs = {
  input: CreateRoleInput;
};


export type MutationcreateUserArgs = {
  input: CreateUserInput;
};


export type MutationdeleteAgencyArgs = {
  id: Scalars['Int'];
};


export type MutationdeleteInputTemplateArgs = {
  id: Scalars['Int'];
};


export type MutationdeleteOrganizationArgs = {
  id: Scalars['Int'];
};


export type MutationdeleteOutputTemplateArgs = {
  id: Scalars['Int'];
};


export type MutationdeleteReportingPeriodArgs = {
  id: Scalars['Int'];
};


export type MutationdeleteRoleArgs = {
  id: Scalars['Int'];
};


export type MutationdeleteUserArgs = {
  id: Scalars['Int'];
};


export type MutationupdateAgencyArgs = {
  id: Scalars['Int'];
  input: UpdateAgencyInput;
};


export type MutationupdateInputTemplateArgs = {
  id: Scalars['Int'];
  input: UpdateInputTemplateInput;
};


export type MutationupdateOrganizationArgs = {
  id: Scalars['Int'];
  input: UpdateOrganizationInput;
};


export type MutationupdateOutputTemplateArgs = {
  id: Scalars['Int'];
  input: UpdateOutputTemplateInput;
};


export type MutationupdateReportingPeriodArgs = {
  id: Scalars['Int'];
  input: UpdateReportingPeriodInput;
};


export type MutationupdateRoleArgs = {
  id: Scalars['Int'];
  input: UpdateRoleInput;
};


export type MutationupdateUserArgs = {
  id: Scalars['Int'];
  input: UpdateUserInput;
};

export type Organization = {
  __typename?: 'Organization';
  agencies: Array<Maybe<Agency>>;
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type OutputTemplate = {
  __typename?: 'OutputTemplate';
  createdAt: Scalars['DateTime'];
  effectiveDate: Scalars['DateTime'];
  id: Scalars['Int'];
  name: Scalars['String'];
  reportingPeriods: Array<Maybe<ReportingPeriod>>;
  rulesGeneratedAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  version: Scalars['String'];
};

/** About the Redwood queries. */
export type Query = {
  __typename?: 'Query';
  agencies: Array<Agency>;
  agenciesByOrganization: Array<Agency>;
  agency?: Maybe<Agency>;
  inputTemplate?: Maybe<InputTemplate>;
  inputTemplates: Array<InputTemplate>;
  organization?: Maybe<Organization>;
  organizations: Array<Organization>;
  outputTemplate?: Maybe<OutputTemplate>;
  outputTemplates: Array<OutputTemplate>;
  /** Fetches the Redwood root schema. */
  redwood?: Maybe<Redwood>;
  reportingPeriod?: Maybe<ReportingPeriod>;
  reportingPeriods: Array<ReportingPeriod>;
  role?: Maybe<Role>;
  roles: Array<Role>;
  user?: Maybe<User>;
  users: Array<User>;
};


/** About the Redwood queries. */
export type QueryagenciesByOrganizationArgs = {
  organizationId: Scalars['Int'];
};


/** About the Redwood queries. */
export type QueryagencyArgs = {
  id: Scalars['Int'];
};


/** About the Redwood queries. */
export type QueryinputTemplateArgs = {
  id: Scalars['Int'];
};


/** About the Redwood queries. */
export type QueryorganizationArgs = {
  id: Scalars['Int'];
};


/** About the Redwood queries. */
export type QueryoutputTemplateArgs = {
  id: Scalars['Int'];
};


/** About the Redwood queries. */
export type QueryreportingPeriodArgs = {
  id: Scalars['Int'];
};


/** About the Redwood queries. */
export type QueryroleArgs = {
  id: Scalars['Int'];
};


/** About the Redwood queries. */
export type QueryuserArgs = {
  id: Scalars['Int'];
};

/**
 * The RedwoodJS Root Schema
 *
 * Defines details about RedwoodJS such as the current user and version information.
 */
export type Redwood = {
  __typename?: 'Redwood';
  /** The current user. */
  currentUser?: Maybe<Scalars['JSON']>;
  /** The version of Prisma. */
  prismaVersion?: Maybe<Scalars['String']>;
  /** The version of Redwood. */
  version?: Maybe<Scalars['String']>;
};

export type ReportingPeriod = {
  __typename?: 'ReportingPeriod';
  certifiedAt?: Maybe<Scalars['DateTime']>;
  certifiedBy?: Maybe<User>;
  certifiedById?: Maybe<Scalars['Int']>;
  createdAt: Scalars['DateTime'];
  endDate: Scalars['DateTime'];
  id: Scalars['Int'];
  inputTemplate: InputTemplate;
  inputTemplateId: Scalars['Int'];
  isCurrentPeriod: Scalars['Boolean'];
  name: Scalars['String'];
  outputTemplate: OutputTemplate;
  outputTemplateId: Scalars['Int'];
  startDate: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type Role = {
  __typename?: 'Role';
  createdAt: Scalars['DateTime'];
  id: Scalars['Int'];
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  users: Array<Maybe<User>>;
};

export type UpdateAgencyInput = {
  abbreviation?: InputMaybe<Scalars['String']>;
  code?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateInputTemplateInput = {
  effectiveDate?: InputMaybe<Scalars['DateTime']>;
  name?: InputMaybe<Scalars['String']>;
  rulesGeneratedAt?: InputMaybe<Scalars['DateTime']>;
  version?: InputMaybe<Scalars['String']>;
};

export type UpdateOrganizationInput = {
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateOutputTemplateInput = {
  effectiveDate?: InputMaybe<Scalars['DateTime']>;
  name?: InputMaybe<Scalars['String']>;
  rulesGeneratedAt?: InputMaybe<Scalars['DateTime']>;
  version?: InputMaybe<Scalars['String']>;
};

export type UpdateReportingPeriodInput = {
  certifiedAt?: InputMaybe<Scalars['DateTime']>;
  certifiedById?: InputMaybe<Scalars['Int']>;
  endDate?: InputMaybe<Scalars['DateTime']>;
  inputTemplateId?: InputMaybe<Scalars['Int']>;
  isCurrentPeriod?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  outputTemplateId?: InputMaybe<Scalars['Int']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
};

export type UpdateRoleInput = {
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateUserInput = {
  agencyId?: InputMaybe<Scalars['Int']>;
  email?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  organizationId?: InputMaybe<Scalars['Int']>;
  roleId?: InputMaybe<Scalars['Int']>;
};

export type User = {
  __typename?: 'User';
  agency?: Maybe<Agency>;
  agencyId?: Maybe<Scalars['Int']>;
  certified: Array<Maybe<ReportingPeriod>>;
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  organization: Organization;
  organizationId: Scalars['Int'];
  role?: Maybe<Role>;
  roleId?: Maybe<Scalars['Int']>;
  updatedAt: Scalars['DateTime'];
};

export type FindAgenciesByOrganizationIdVariables = Exact<{
  organizationId: Scalars['Int'];
}>;


export type FindAgenciesByOrganizationId = { __typename?: 'Query', agenciesByOrganization: Array<{ __typename?: 'Agency', id: number, name: string, abbreviation?: string | null, code: string }> };

export type DeleteAgencyMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteAgencyMutation = { __typename?: 'Mutation', deleteAgency: { __typename?: 'Agency', id: number } };

export type FindAgencyByIdVariables = Exact<{
  id: Scalars['Int'];
}>;


export type FindAgencyById = { __typename?: 'Query', agency?: { __typename?: 'Agency', id: number, name: string, abbreviation?: string | null, code: string } | null };

export type EditAgencyByIdVariables = Exact<{
  id: Scalars['Int'];
}>;


export type EditAgencyById = { __typename?: 'Query', agency?: { __typename?: 'Agency', id: number, name: string, abbreviation?: string | null, code: string } | null };

export type UpdateAgencyMutationVariables = Exact<{
  id: Scalars['Int'];
  input: UpdateAgencyInput;
}>;


export type UpdateAgencyMutation = { __typename?: 'Mutation', updateAgency: { __typename?: 'Agency', id: number, name: string, abbreviation?: string | null, code: string } };

export type CreateAgencyMutationVariables = Exact<{
  input: CreateAgencyInput;
}>;


export type CreateAgencyMutation = { __typename?: 'Mutation', createAgency: { __typename?: 'Agency', id: number } };

export type EditOrganizationByIdVariables = Exact<{
  id: Scalars['Int'];
}>;


export type EditOrganizationById = { __typename?: 'Query', organization?: { __typename?: 'Organization', id: number, name: string } | null };

export type UpdateOrganizationMutationVariables = Exact<{
  id: Scalars['Int'];
  input: UpdateOrganizationInput;
}>;


export type UpdateOrganizationMutation = { __typename?: 'Mutation', updateOrganization: { __typename?: 'Organization', id: number, name: string } };

export type CreateOrganizationMutationVariables = Exact<{
  input: CreateOrganizationInput;
}>;


export type CreateOrganizationMutation = { __typename?: 'Mutation', createOrganization: { __typename?: 'Organization', id: number } };

export type DeleteOrganizationMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteOrganizationMutation = { __typename?: 'Mutation', deleteOrganization: { __typename?: 'Organization', id: number } };

export type FindOrganizationByIdVariables = Exact<{
  id: Scalars['Int'];
}>;


export type FindOrganizationById = { __typename?: 'Query', organization?: { __typename?: 'Organization', id: number, name: string } | null };

export type FindOrganizationsVariables = Exact<{ [key: string]: never; }>;


export type FindOrganizations = { __typename?: 'Query', organizations: Array<{ __typename?: 'Organization', id: number, name: string }> };

export type FindReportingPeriodQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type FindReportingPeriodQuery = { __typename?: 'Query', reportingPeriod?: { __typename?: 'ReportingPeriod', name: string } | null };

export type ReportingPeriodsQueryVariables = Exact<{ [key: string]: never; }>;


export type ReportingPeriodsQuery = { __typename?: 'Query', reportingPeriods: Array<{ __typename?: 'ReportingPeriod', id: number, startDate: string, endDate: string, isCurrentPeriod: boolean, certifiedAt?: string | null, certifiedBy?: { __typename?: 'User', email: string } | null, inputTemplate: { __typename?: 'InputTemplate', name: string } }> };

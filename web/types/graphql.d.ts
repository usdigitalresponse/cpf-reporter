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
  tenantId: Scalars['Int'];
};

export type CreateAgencyInput = {
  abbreviation?: InputMaybe<Scalars['String']>;
  code: Scalars['String'];
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAgency: Agency;
  deleteAgency: Agency;
  updateAgency: Agency;
};


export type MutationcreateAgencyArgs = {
  input: CreateAgencyInput;
};


export type MutationdeleteAgencyArgs = {
  id: Scalars['Int'];
};


export type MutationupdateAgencyArgs = {
  id: Scalars['Int'];
  input: UpdateAgencyInput;
};

/** About the Redwood queries. */
export type Query = {
  __typename?: 'Query';
  agencies: Array<Agency>;
  agenciesByTenant: Array<Agency>;
  agency?: Maybe<Agency>;
  /** Fetches the Redwood root schema. */
  redwood?: Maybe<Redwood>;
};


/** About the Redwood queries. */
export type QueryagenciesByTenantArgs = {
  tenantId: Scalars['Int'];
};


/** About the Redwood queries. */
export type QueryagencyArgs = {
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

export type UpdateAgencyInput = {
  abbreviation?: InputMaybe<Scalars['String']>;
  code?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type FindAgenciesByTenantIdVariables = Exact<{
  tenantId: Scalars['Int'];
}>;


export type FindAgenciesByTenantId = { __typename?: 'Query', agenciesByTenant: Array<{ __typename?: 'Agency', id: number, name: string, abbreviation?: string | null, code: string }> };

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

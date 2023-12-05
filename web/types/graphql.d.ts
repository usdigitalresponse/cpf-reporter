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

export type CreateInputTemplateInput = {
  effectiveDate: Scalars['DateTime'];
  name: Scalars['String'];
  rulesGeneratedAt: Scalars['DateTime'];
  version: Scalars['String'];
};

export type CreateOutputTemplateInput = {
  effectiveDate: Scalars['DateTime'];
  name: Scalars['String'];
  rulesGeneratedAt: Scalars['DateTime'];
  version: Scalars['String'];
};

export type CreateReportingPeriodInput = {
  certifiedAt?: InputMaybe<Scalars['DateTime']>;
  endDate: Scalars['DateTime'];
  inputTemplateId: Scalars['Int'];
  isCurrentPeriod: Scalars['Boolean'];
  name: Scalars['String'];
  outputTemplateId: Scalars['Int'];
  startDate: Scalars['DateTime'];
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
  createInputTemplate: InputTemplate;
  createOutputTemplate: OutputTemplate;
  createReportingPeriod: ReportingPeriod;
  deleteInputTemplate: InputTemplate;
  deleteOutputTemplate: OutputTemplate;
  deleteReportingPeriod: ReportingPeriod;
  updateInputTemplate: InputTemplate;
  updateOutputTemplate: OutputTemplate;
  updateReportingPeriod: ReportingPeriod;
};


export type MutationcreateInputTemplateArgs = {
  input: CreateInputTemplateInput;
};


export type MutationcreateOutputTemplateArgs = {
  input: CreateOutputTemplateInput;
};


export type MutationcreateReportingPeriodArgs = {
  input: CreateReportingPeriodInput;
};


export type MutationdeleteInputTemplateArgs = {
  id: Scalars['Int'];
};


export type MutationdeleteOutputTemplateArgs = {
  id: Scalars['Int'];
};


export type MutationdeleteReportingPeriodArgs = {
  id: Scalars['Int'];
};


export type MutationupdateInputTemplateArgs = {
  id: Scalars['Int'];
  input: UpdateInputTemplateInput;
};


export type MutationupdateOutputTemplateArgs = {
  id: Scalars['Int'];
  input: UpdateOutputTemplateInput;
};


export type MutationupdateReportingPeriodArgs = {
  id: Scalars['Int'];
  input: UpdateReportingPeriodInput;
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
  inputTemplate?: Maybe<InputTemplate>;
  inputTemplates: Array<InputTemplate>;
  outputTemplate?: Maybe<OutputTemplate>;
  outputTemplates: Array<OutputTemplate>;
  /** Fetches the Redwood root schema. */
  redwood?: Maybe<Redwood>;
  reportingPeriod?: Maybe<ReportingPeriod>;
  reportingPeriods: Array<ReportingPeriod>;
};


/** About the Redwood queries. */
export type QueryinputTemplateArgs = {
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

export type UpdateInputTemplateInput = {
  effectiveDate?: InputMaybe<Scalars['DateTime']>;
  name?: InputMaybe<Scalars['String']>;
  rulesGeneratedAt?: InputMaybe<Scalars['DateTime']>;
  version?: InputMaybe<Scalars['String']>;
};

export type UpdateOutputTemplateInput = {
  effectiveDate?: InputMaybe<Scalars['DateTime']>;
  name?: InputMaybe<Scalars['String']>;
  rulesGeneratedAt?: InputMaybe<Scalars['DateTime']>;
  version?: InputMaybe<Scalars['String']>;
};

export type UpdateReportingPeriodInput = {
  certifiedAt?: InputMaybe<Scalars['DateTime']>;
  endDate?: InputMaybe<Scalars['DateTime']>;
  inputTemplateId?: InputMaybe<Scalars['Int']>;
  isCurrentPeriod?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  outputTemplateId?: InputMaybe<Scalars['Int']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
};

export type ReportingPeriodsQueryVariables = Exact<{ [key: string]: never; }>;


export type ReportingPeriodsQuery = { __typename?: 'Query', reportingPeriods: Array<{ __typename?: 'ReportingPeriod', id: number, startDate: string, endDate: string, certifiedAt?: string | null }> };

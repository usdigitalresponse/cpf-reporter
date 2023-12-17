import { Prisma } from "@prisma/client"
import { MergePrismaWithSdlTypes, MakeRelationsOptional } from '@redwoodjs/api'
import { Agency as PrismaAgency, Organization as PrismaOrganization, User as PrismaUser, Role as PrismaRole, InputTemplate as PrismaInputTemplate, OutputTemplate as PrismaOutputTemplate, ReportingPeriod as PrismaReportingPeriod, ExpenditureCategory as PrismaExpenditureCategory, Upload as PrismaUpload, UploadValidation as PrismaUploadValidation, Subrecipient as PrismaSubrecipient, Project as PrismaProject } from '@prisma/client'
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { RedwoodGraphQLContext } from '@redwoodjs/graphql-server/dist/types';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type ResolverFn<TResult, TParent, TContext, TArgs> = (
      args?: TArgs,
      obj?: { root: TParent; context: TContext; info: GraphQLResolveInfo }
    ) => TResult | Promise<TResult>
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
export type OptArgsResolverFn<TResult, TParent = {}, TContext = {}, TArgs = {}> = (
      args?: TArgs,
      obj?: { root: TParent; context: TContext; info: GraphQLResolveInfo }
    ) => TResult | Promise<TResult>

    export type RequiredResolverFn<TResult, TParent = {}, TContext = {}, TArgs = {}> = (
      args: TArgs,
      obj: { root: TParent; context: TContext; info: GraphQLResolveInfo }
    ) => TResult | Promise<TResult>
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigInt: number;
  Date: Date | string;
  DateTime: Date | string;
  JSON: Prisma.JsonValue;
  JSONObject: Prisma.JsonObject;
  Time: Date | string;
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

export type CreateExpenditureCategoryInput = {
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

export type CreateProjectInput = {
  agencyId: Scalars['Int'];
  code: Scalars['String'];
  description: Scalars['String'];
  name: Scalars['String'];
  organizationId: Scalars['Int'];
  originationPeriodId: Scalars['Int'];
  status: Scalars['String'];
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

export type CreateSubrecipientInput = {
  certifiedAt?: InputMaybe<Scalars['DateTime']>;
  certifiedById?: InputMaybe<Scalars['Int']>;
  endDate: Scalars['DateTime'];
  name: Scalars['String'];
  organizationId: Scalars['Int'];
  originationUploadId: Scalars['Int'];
  startDate: Scalars['DateTime'];
};

export type CreateUploadInput = {
  agencyId: Scalars['Int'];
  expenditureCategoryId: Scalars['Int'];
  filename: Scalars['String'];
  organizationId: Scalars['Int'];
  reportingPeriodId: Scalars['Int'];
  uploadedById: Scalars['Int'];
};

export type CreateUploadValidationInput = {
  agencyId: Scalars['Int'];
  inputTemplateId: Scalars['Int'];
  invalidatedAt?: InputMaybe<Scalars['DateTime']>;
  invalidatedById?: InputMaybe<Scalars['Int']>;
  invalidationResults?: InputMaybe<Scalars['JSON']>;
  organizationId: Scalars['Int'];
  uploadId: Scalars['Int'];
  validatedAt?: InputMaybe<Scalars['DateTime']>;
  validatedById?: InputMaybe<Scalars['Int']>;
  validationResults?: InputMaybe<Scalars['JSON']>;
};

export type CreateUserInput = {
  agencyId?: InputMaybe<Scalars['Int']>;
  email: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  organizationId: Scalars['Int'];
  roleId?: InputMaybe<Scalars['Int']>;
};

export type ExpenditureCategory = {
  __typename?: 'ExpenditureCategory';
  Uploads: Array<Maybe<Upload>>;
  code: Scalars['String'];
  createdAt: Scalars['DateTime'];
  id: Scalars['Int'];
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
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
  createExpenditureCategory: ExpenditureCategory;
  createInputTemplate: InputTemplate;
  createOrganization: Organization;
  createOutputTemplate: OutputTemplate;
  createProject: Project;
  createReportingPeriod: ReportingPeriod;
  createRole: Role;
  createSubrecipient: Subrecipient;
  createUpload: Upload;
  createUploadValidation: UploadValidation;
  createUser: User;
  deleteAgency: Agency;
  deleteExpenditureCategory: ExpenditureCategory;
  deleteInputTemplate: InputTemplate;
  deleteOrganization: Organization;
  deleteOutputTemplate: OutputTemplate;
  deleteProject: Project;
  deleteReportingPeriod: ReportingPeriod;
  deleteRole: Role;
  deleteSubrecipient: Subrecipient;
  deleteUpload: Upload;
  deleteUploadValidation: UploadValidation;
  deleteUser: User;
  updateAgency: Agency;
  updateExpenditureCategory: ExpenditureCategory;
  updateInputTemplate: InputTemplate;
  updateOrganization: Organization;
  updateOutputTemplate: OutputTemplate;
  updateProject: Project;
  updateReportingPeriod: ReportingPeriod;
  updateRole: Role;
  updateSubrecipient: Subrecipient;
  updateUpload: Upload;
  updateUploadValidation: UploadValidation;
  updateUser: User;
};


export type MutationcreateAgencyArgs = {
  input: CreateAgencyInput;
};


export type MutationcreateExpenditureCategoryArgs = {
  input: CreateExpenditureCategoryInput;
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


export type MutationcreateProjectArgs = {
  input: CreateProjectInput;
};


export type MutationcreateReportingPeriodArgs = {
  input: CreateReportingPeriodInput;
};


export type MutationcreateRoleArgs = {
  input: CreateRoleInput;
};


export type MutationcreateSubrecipientArgs = {
  input: CreateSubrecipientInput;
};


export type MutationcreateUploadArgs = {
  input: CreateUploadInput;
};


export type MutationcreateUploadValidationArgs = {
  input: CreateUploadValidationInput;
};


export type MutationcreateUserArgs = {
  input: CreateUserInput;
};


export type MutationdeleteAgencyArgs = {
  id: Scalars['Int'];
};


export type MutationdeleteExpenditureCategoryArgs = {
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


export type MutationdeleteProjectArgs = {
  id: Scalars['Int'];
};


export type MutationdeleteReportingPeriodArgs = {
  id: Scalars['Int'];
};


export type MutationdeleteRoleArgs = {
  id: Scalars['Int'];
};


export type MutationdeleteSubrecipientArgs = {
  id: Scalars['Int'];
};


export type MutationdeleteUploadArgs = {
  id: Scalars['Int'];
};


export type MutationdeleteUploadValidationArgs = {
  id: Scalars['Int'];
};


export type MutationdeleteUserArgs = {
  id: Scalars['Int'];
};


export type MutationupdateAgencyArgs = {
  id: Scalars['Int'];
  input: UpdateAgencyInput;
};


export type MutationupdateExpenditureCategoryArgs = {
  id: Scalars['Int'];
  input: UpdateExpenditureCategoryInput;
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


export type MutationupdateProjectArgs = {
  id: Scalars['Int'];
  input: UpdateProjectInput;
};


export type MutationupdateReportingPeriodArgs = {
  id: Scalars['Int'];
  input: UpdateReportingPeriodInput;
};


export type MutationupdateRoleArgs = {
  id: Scalars['Int'];
  input: UpdateRoleInput;
};


export type MutationupdateSubrecipientArgs = {
  id: Scalars['Int'];
  input: UpdateSubrecipientInput;
};


export type MutationupdateUploadArgs = {
  id: Scalars['Int'];
  input: UpdateUploadInput;
};


export type MutationupdateUploadValidationArgs = {
  id: Scalars['Int'];
  input: UpdateUploadValidationInput;
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

export type Project = {
  __typename?: 'Project';
  agency: Agency;
  agencyId: Scalars['Int'];
  code: Scalars['String'];
  createdAt: Scalars['DateTime'];
  description: Scalars['String'];
  id: Scalars['Int'];
  name: Scalars['String'];
  organization: Organization;
  organizationId: Scalars['Int'];
  originationPeriod: ReportingPeriod;
  originationPeriodId: Scalars['Int'];
  status: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

/** About the Redwood queries. */
export type Query = {
  __typename?: 'Query';
  agencies: Array<Agency>;
  agenciesByOrganization: Array<Agency>;
  agency?: Maybe<Agency>;
  expenditureCategories: Array<ExpenditureCategory>;
  expenditureCategory?: Maybe<ExpenditureCategory>;
  inputTemplate?: Maybe<InputTemplate>;
  inputTemplates: Array<InputTemplate>;
  organization?: Maybe<Organization>;
  organizations: Array<Organization>;
  outputTemplate?: Maybe<OutputTemplate>;
  outputTemplates: Array<OutputTemplate>;
  previousReportingPeriods: Array<ReportingPeriod>;
  project?: Maybe<Project>;
  projects: Array<Project>;
  /** Fetches the Redwood root schema. */
  redwood?: Maybe<Redwood>;
  reportingPeriod?: Maybe<ReportingPeriod>;
  reportingPeriods: Array<ReportingPeriod>;
  reportingPeriodsByOrg: Array<ReportingPeriod>;
  role?: Maybe<Role>;
  roles: Array<Role>;
  subrecipient?: Maybe<Subrecipient>;
  subrecipients: Array<Subrecipient>;
  upload?: Maybe<Upload>;
  uploadValidation?: Maybe<UploadValidation>;
  uploadValidations: Array<UploadValidation>;
  uploads: Array<Upload>;
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
export type QueryexpenditureCategoryArgs = {
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
export type QuerypreviousReportingPeriodsArgs = {
  id: Scalars['Int'];
  organizationId: Scalars['Int'];
};


/** About the Redwood queries. */
export type QueryprojectArgs = {
  id: Scalars['Int'];
};


/** About the Redwood queries. */
export type QueryreportingPeriodArgs = {
  id: Scalars['Int'];
};


/** About the Redwood queries. */
export type QueryreportingPeriodsByOrgArgs = {
  organizationId: Scalars['Int'];
};


/** About the Redwood queries. */
export type QueryroleArgs = {
  id: Scalars['Int'];
};


/** About the Redwood queries. */
export type QuerysubrecipientArgs = {
  id: Scalars['Int'];
};


/** About the Redwood queries. */
export type QueryuploadArgs = {
  id: Scalars['Int'];
};


/** About the Redwood queries. */
export type QueryuploadValidationArgs = {
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

export type Subrecipient = {
  __typename?: 'Subrecipient';
  certifiedAt?: Maybe<Scalars['DateTime']>;
  certifiedBy?: Maybe<User>;
  certifiedById?: Maybe<Scalars['Int']>;
  createdAt: Scalars['DateTime'];
  endDate: Scalars['DateTime'];
  id: Scalars['Int'];
  name: Scalars['String'];
  organization: Organization;
  organizationId: Scalars['Int'];
  originationUpload: Upload;
  originationUploadId: Scalars['Int'];
  startDate: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type UpdateAgencyInput = {
  abbreviation?: InputMaybe<Scalars['String']>;
  code?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateExpenditureCategoryInput = {
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

export type UpdateProjectInput = {
  agencyId?: InputMaybe<Scalars['Int']>;
  code?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  organizationId?: InputMaybe<Scalars['Int']>;
  originationPeriodId?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<Scalars['String']>;
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

export type UpdateSubrecipientInput = {
  certifiedAt?: InputMaybe<Scalars['DateTime']>;
  certifiedById?: InputMaybe<Scalars['Int']>;
  endDate?: InputMaybe<Scalars['DateTime']>;
  name?: InputMaybe<Scalars['String']>;
  organizationId?: InputMaybe<Scalars['Int']>;
  originationUploadId?: InputMaybe<Scalars['Int']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
};

export type UpdateUploadInput = {
  agencyId?: InputMaybe<Scalars['Int']>;
  expenditureCategoryId?: InputMaybe<Scalars['Int']>;
  filename?: InputMaybe<Scalars['String']>;
  organizationId?: InputMaybe<Scalars['Int']>;
  reportingPeriodId?: InputMaybe<Scalars['Int']>;
  uploadedById?: InputMaybe<Scalars['Int']>;
};

export type UpdateUploadValidationInput = {
  agencyId?: InputMaybe<Scalars['Int']>;
  inputTemplateId?: InputMaybe<Scalars['Int']>;
  invalidatedAt?: InputMaybe<Scalars['DateTime']>;
  invalidatedById?: InputMaybe<Scalars['Int']>;
  invalidationResults?: InputMaybe<Scalars['JSON']>;
  organizationId?: InputMaybe<Scalars['Int']>;
  uploadId?: InputMaybe<Scalars['Int']>;
  validatedAt?: InputMaybe<Scalars['DateTime']>;
  validatedById?: InputMaybe<Scalars['Int']>;
  validationResults?: InputMaybe<Scalars['JSON']>;
};

export type UpdateUserInput = {
  agencyId?: InputMaybe<Scalars['Int']>;
  email?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  organizationId?: InputMaybe<Scalars['Int']>;
  roleId?: InputMaybe<Scalars['Int']>;
};

export type Upload = {
  __typename?: 'Upload';
  agency: Agency;
  agencyId: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  expenditureCategory: ExpenditureCategory;
  expenditureCategoryId: Scalars['Int'];
  filename: Scalars['String'];
  id: Scalars['Int'];
  organization: Organization;
  organizationId: Scalars['Int'];
  reportingPeriod: ReportingPeriod;
  reportingPeriodId: Scalars['Int'];
  updatedAt: Scalars['DateTime'];
  uploadedBy: User;
  uploadedById: Scalars['Int'];
  validations: Array<Maybe<UploadValidation>>;
};

export type UploadValidation = {
  __typename?: 'UploadValidation';
  agency: Agency;
  agencyId: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  id: Scalars['Int'];
  inputTemplate: InputTemplate;
  inputTemplateId: Scalars['Int'];
  invalidatedAt?: Maybe<Scalars['DateTime']>;
  invalidatedBy?: Maybe<User>;
  invalidatedById?: Maybe<Scalars['Int']>;
  invalidationResults?: Maybe<Scalars['JSON']>;
  organization: Organization;
  organizationId: Scalars['Int'];
  updatedAt: Scalars['DateTime'];
  upload: Upload;
  uploadId: Scalars['Int'];
  validatedAt?: Maybe<Scalars['DateTime']>;
  validatedBy?: Maybe<User>;
  validatedById?: Maybe<Scalars['Int']>;
  validationResults?: Maybe<Scalars['JSON']>;
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

type MaybeOrArrayOfMaybe<T> = T | Maybe<T> | Maybe<T>[];
type AllMappedModels = MaybeOrArrayOfMaybe<Agency | ExpenditureCategory | InputTemplate | Organization | OutputTemplate | Project | ReportingPeriod | Role | Subrecipient | Upload | UploadValidation | User>


export type ResolverTypeWrapper<T> = Promise<T> | T;

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Agency: ResolverTypeWrapper<MergePrismaWithSdlTypes<PrismaAgency, MakeRelationsOptional<Agency, AllMappedModels>, AllMappedModels>>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CreateAgencyInput: CreateAgencyInput;
  CreateExpenditureCategoryInput: CreateExpenditureCategoryInput;
  CreateInputTemplateInput: CreateInputTemplateInput;
  CreateOrganizationInput: CreateOrganizationInput;
  CreateOutputTemplateInput: CreateOutputTemplateInput;
  CreateProjectInput: CreateProjectInput;
  CreateReportingPeriodInput: CreateReportingPeriodInput;
  CreateRoleInput: CreateRoleInput;
  CreateSubrecipientInput: CreateSubrecipientInput;
  CreateUploadInput: CreateUploadInput;
  CreateUploadValidationInput: CreateUploadValidationInput;
  CreateUserInput: CreateUserInput;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  ExpenditureCategory: ResolverTypeWrapper<MergePrismaWithSdlTypes<PrismaExpenditureCategory, MakeRelationsOptional<ExpenditureCategory, AllMappedModels>, AllMappedModels>>;
  InputTemplate: ResolverTypeWrapper<MergePrismaWithSdlTypes<PrismaInputTemplate, MakeRelationsOptional<InputTemplate, AllMappedModels>, AllMappedModels>>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']>;
  Mutation: ResolverTypeWrapper<{}>;
  Organization: ResolverTypeWrapper<MergePrismaWithSdlTypes<PrismaOrganization, MakeRelationsOptional<Organization, AllMappedModels>, AllMappedModels>>;
  OutputTemplate: ResolverTypeWrapper<MergePrismaWithSdlTypes<PrismaOutputTemplate, MakeRelationsOptional<OutputTemplate, AllMappedModels>, AllMappedModels>>;
  Project: ResolverTypeWrapper<MergePrismaWithSdlTypes<PrismaProject, MakeRelationsOptional<Project, AllMappedModels>, AllMappedModels>>;
  Query: ResolverTypeWrapper<{}>;
  Redwood: ResolverTypeWrapper<Redwood>;
  ReportingPeriod: ResolverTypeWrapper<MergePrismaWithSdlTypes<PrismaReportingPeriod, MakeRelationsOptional<ReportingPeriod, AllMappedModels>, AllMappedModels>>;
  Role: ResolverTypeWrapper<MergePrismaWithSdlTypes<PrismaRole, MakeRelationsOptional<Role, AllMappedModels>, AllMappedModels>>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subrecipient: ResolverTypeWrapper<MergePrismaWithSdlTypes<PrismaSubrecipient, MakeRelationsOptional<Subrecipient, AllMappedModels>, AllMappedModels>>;
  Time: ResolverTypeWrapper<Scalars['Time']>;
  UpdateAgencyInput: UpdateAgencyInput;
  UpdateExpenditureCategoryInput: UpdateExpenditureCategoryInput;
  UpdateInputTemplateInput: UpdateInputTemplateInput;
  UpdateOrganizationInput: UpdateOrganizationInput;
  UpdateOutputTemplateInput: UpdateOutputTemplateInput;
  UpdateProjectInput: UpdateProjectInput;
  UpdateReportingPeriodInput: UpdateReportingPeriodInput;
  UpdateRoleInput: UpdateRoleInput;
  UpdateSubrecipientInput: UpdateSubrecipientInput;
  UpdateUploadInput: UpdateUploadInput;
  UpdateUploadValidationInput: UpdateUploadValidationInput;
  UpdateUserInput: UpdateUserInput;
  Upload: ResolverTypeWrapper<MergePrismaWithSdlTypes<PrismaUpload, MakeRelationsOptional<Upload, AllMappedModels>, AllMappedModels>>;
  UploadValidation: ResolverTypeWrapper<MergePrismaWithSdlTypes<PrismaUploadValidation, MakeRelationsOptional<UploadValidation, AllMappedModels>, AllMappedModels>>;
  User: ResolverTypeWrapper<MergePrismaWithSdlTypes<PrismaUser, MakeRelationsOptional<User, AllMappedModels>, AllMappedModels>>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Agency: MergePrismaWithSdlTypes<PrismaAgency, MakeRelationsOptional<Agency, AllMappedModels>, AllMappedModels>;
  BigInt: Scalars['BigInt'];
  Boolean: Scalars['Boolean'];
  CreateAgencyInput: CreateAgencyInput;
  CreateExpenditureCategoryInput: CreateExpenditureCategoryInput;
  CreateInputTemplateInput: CreateInputTemplateInput;
  CreateOrganizationInput: CreateOrganizationInput;
  CreateOutputTemplateInput: CreateOutputTemplateInput;
  CreateProjectInput: CreateProjectInput;
  CreateReportingPeriodInput: CreateReportingPeriodInput;
  CreateRoleInput: CreateRoleInput;
  CreateSubrecipientInput: CreateSubrecipientInput;
  CreateUploadInput: CreateUploadInput;
  CreateUploadValidationInput: CreateUploadValidationInput;
  CreateUserInput: CreateUserInput;
  Date: Scalars['Date'];
  DateTime: Scalars['DateTime'];
  ExpenditureCategory: MergePrismaWithSdlTypes<PrismaExpenditureCategory, MakeRelationsOptional<ExpenditureCategory, AllMappedModels>, AllMappedModels>;
  InputTemplate: MergePrismaWithSdlTypes<PrismaInputTemplate, MakeRelationsOptional<InputTemplate, AllMappedModels>, AllMappedModels>;
  Int: Scalars['Int'];
  JSON: Scalars['JSON'];
  JSONObject: Scalars['JSONObject'];
  Mutation: {};
  Organization: MergePrismaWithSdlTypes<PrismaOrganization, MakeRelationsOptional<Organization, AllMappedModels>, AllMappedModels>;
  OutputTemplate: MergePrismaWithSdlTypes<PrismaOutputTemplate, MakeRelationsOptional<OutputTemplate, AllMappedModels>, AllMappedModels>;
  Project: MergePrismaWithSdlTypes<PrismaProject, MakeRelationsOptional<Project, AllMappedModels>, AllMappedModels>;
  Query: {};
  Redwood: Redwood;
  ReportingPeriod: MergePrismaWithSdlTypes<PrismaReportingPeriod, MakeRelationsOptional<ReportingPeriod, AllMappedModels>, AllMappedModels>;
  Role: MergePrismaWithSdlTypes<PrismaRole, MakeRelationsOptional<Role, AllMappedModels>, AllMappedModels>;
  String: Scalars['String'];
  Subrecipient: MergePrismaWithSdlTypes<PrismaSubrecipient, MakeRelationsOptional<Subrecipient, AllMappedModels>, AllMappedModels>;
  Time: Scalars['Time'];
  UpdateAgencyInput: UpdateAgencyInput;
  UpdateExpenditureCategoryInput: UpdateExpenditureCategoryInput;
  UpdateInputTemplateInput: UpdateInputTemplateInput;
  UpdateOrganizationInput: UpdateOrganizationInput;
  UpdateOutputTemplateInput: UpdateOutputTemplateInput;
  UpdateProjectInput: UpdateProjectInput;
  UpdateReportingPeriodInput: UpdateReportingPeriodInput;
  UpdateRoleInput: UpdateRoleInput;
  UpdateSubrecipientInput: UpdateSubrecipientInput;
  UpdateUploadInput: UpdateUploadInput;
  UpdateUploadValidationInput: UpdateUploadValidationInput;
  UpdateUserInput: UpdateUserInput;
  Upload: MergePrismaWithSdlTypes<PrismaUpload, MakeRelationsOptional<Upload, AllMappedModels>, AllMappedModels>;
  UploadValidation: MergePrismaWithSdlTypes<PrismaUploadValidation, MakeRelationsOptional<UploadValidation, AllMappedModels>, AllMappedModels>;
  User: MergePrismaWithSdlTypes<PrismaUser, MakeRelationsOptional<User, AllMappedModels>, AllMappedModels>;
};

export type requireAuthDirectiveArgs = {
  roles?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type requireAuthDirectiveResolver<Result, Parent, ContextType = RedwoodGraphQLContext, Args = requireAuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type skipAuthDirectiveArgs = { };

export type skipAuthDirectiveResolver<Result, Parent, ContextType = RedwoodGraphQLContext, Args = skipAuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AgencyResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Agency'] = ResolversParentTypes['Agency']> = {
  abbreviation: OptArgsResolverFn<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  code: OptArgsResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  id: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  name: OptArgsResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  organizationId: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AgencyRelationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Agency'] = ResolversParentTypes['Agency']> = {
  abbreviation?: RequiredResolverFn<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  code?: RequiredResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  id?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  name?: RequiredResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  organizationId?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type ExpenditureCategoryResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['ExpenditureCategory'] = ResolversParentTypes['ExpenditureCategory']> = {
  Uploads: OptArgsResolverFn<Array<Maybe<ResolversTypes['Upload']>>, ParentType, ContextType>;
  code: OptArgsResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  id: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  name: OptArgsResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExpenditureCategoryRelationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['ExpenditureCategory'] = ResolversParentTypes['ExpenditureCategory']> = {
  Uploads?: RequiredResolverFn<Array<Maybe<ResolversTypes['Upload']>>, ParentType, ContextType>;
  code?: RequiredResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  name?: RequiredResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InputTemplateResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['InputTemplate'] = ResolversParentTypes['InputTemplate']> = {
  createdAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  effectiveDate: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  id: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  name: OptArgsResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  reportingPeriods: OptArgsResolverFn<Array<Maybe<ResolversTypes['ReportingPeriod']>>, ParentType, ContextType>;
  rulesGeneratedAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  version: OptArgsResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InputTemplateRelationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['InputTemplate'] = ResolversParentTypes['InputTemplate']> = {
  createdAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  effectiveDate?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  name?: RequiredResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  reportingPeriods?: RequiredResolverFn<Array<Maybe<ResolversTypes['ReportingPeriod']>>, ParentType, ContextType>;
  rulesGeneratedAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  version?: RequiredResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JSONScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export interface JSONObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject';
}

export type MutationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createAgency: Resolver<ResolversTypes['Agency'], ParentType, ContextType, RequireFields<MutationcreateAgencyArgs, 'input'>>;
  createExpenditureCategory: Resolver<ResolversTypes['ExpenditureCategory'], ParentType, ContextType, RequireFields<MutationcreateExpenditureCategoryArgs, 'input'>>;
  createInputTemplate: Resolver<ResolversTypes['InputTemplate'], ParentType, ContextType, RequireFields<MutationcreateInputTemplateArgs, 'input'>>;
  createOrganization: Resolver<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationcreateOrganizationArgs, 'input'>>;
  createOutputTemplate: Resolver<ResolversTypes['OutputTemplate'], ParentType, ContextType, RequireFields<MutationcreateOutputTemplateArgs, 'input'>>;
  createProject: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationcreateProjectArgs, 'input'>>;
  createReportingPeriod: Resolver<ResolversTypes['ReportingPeriod'], ParentType, ContextType, RequireFields<MutationcreateReportingPeriodArgs, 'input'>>;
  createRole: Resolver<ResolversTypes['Role'], ParentType, ContextType, RequireFields<MutationcreateRoleArgs, 'input'>>;
  createSubrecipient: Resolver<ResolversTypes['Subrecipient'], ParentType, ContextType, RequireFields<MutationcreateSubrecipientArgs, 'input'>>;
  createUpload: Resolver<ResolversTypes['Upload'], ParentType, ContextType, RequireFields<MutationcreateUploadArgs, 'input'>>;
  createUploadValidation: Resolver<ResolversTypes['UploadValidation'], ParentType, ContextType, RequireFields<MutationcreateUploadValidationArgs, 'input'>>;
  createUser: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationcreateUserArgs, 'input'>>;
  deleteAgency: Resolver<ResolversTypes['Agency'], ParentType, ContextType, RequireFields<MutationdeleteAgencyArgs, 'id'>>;
  deleteExpenditureCategory: Resolver<ResolversTypes['ExpenditureCategory'], ParentType, ContextType, RequireFields<MutationdeleteExpenditureCategoryArgs, 'id'>>;
  deleteInputTemplate: Resolver<ResolversTypes['InputTemplate'], ParentType, ContextType, RequireFields<MutationdeleteInputTemplateArgs, 'id'>>;
  deleteOrganization: Resolver<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationdeleteOrganizationArgs, 'id'>>;
  deleteOutputTemplate: Resolver<ResolversTypes['OutputTemplate'], ParentType, ContextType, RequireFields<MutationdeleteOutputTemplateArgs, 'id'>>;
  deleteProject: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationdeleteProjectArgs, 'id'>>;
  deleteReportingPeriod: Resolver<ResolversTypes['ReportingPeriod'], ParentType, ContextType, RequireFields<MutationdeleteReportingPeriodArgs, 'id'>>;
  deleteRole: Resolver<ResolversTypes['Role'], ParentType, ContextType, RequireFields<MutationdeleteRoleArgs, 'id'>>;
  deleteSubrecipient: Resolver<ResolversTypes['Subrecipient'], ParentType, ContextType, RequireFields<MutationdeleteSubrecipientArgs, 'id'>>;
  deleteUpload: Resolver<ResolversTypes['Upload'], ParentType, ContextType, RequireFields<MutationdeleteUploadArgs, 'id'>>;
  deleteUploadValidation: Resolver<ResolversTypes['UploadValidation'], ParentType, ContextType, RequireFields<MutationdeleteUploadValidationArgs, 'id'>>;
  deleteUser: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationdeleteUserArgs, 'id'>>;
  updateAgency: Resolver<ResolversTypes['Agency'], ParentType, ContextType, RequireFields<MutationupdateAgencyArgs, 'id' | 'input'>>;
  updateExpenditureCategory: Resolver<ResolversTypes['ExpenditureCategory'], ParentType, ContextType, RequireFields<MutationupdateExpenditureCategoryArgs, 'id' | 'input'>>;
  updateInputTemplate: Resolver<ResolversTypes['InputTemplate'], ParentType, ContextType, RequireFields<MutationupdateInputTemplateArgs, 'id' | 'input'>>;
  updateOrganization: Resolver<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationupdateOrganizationArgs, 'id' | 'input'>>;
  updateOutputTemplate: Resolver<ResolversTypes['OutputTemplate'], ParentType, ContextType, RequireFields<MutationupdateOutputTemplateArgs, 'id' | 'input'>>;
  updateProject: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationupdateProjectArgs, 'id' | 'input'>>;
  updateReportingPeriod: Resolver<ResolversTypes['ReportingPeriod'], ParentType, ContextType, RequireFields<MutationupdateReportingPeriodArgs, 'id' | 'input'>>;
  updateRole: Resolver<ResolversTypes['Role'], ParentType, ContextType, RequireFields<MutationupdateRoleArgs, 'id' | 'input'>>;
  updateSubrecipient: Resolver<ResolversTypes['Subrecipient'], ParentType, ContextType, RequireFields<MutationupdateSubrecipientArgs, 'id' | 'input'>>;
  updateUpload: Resolver<ResolversTypes['Upload'], ParentType, ContextType, RequireFields<MutationupdateUploadArgs, 'id' | 'input'>>;
  updateUploadValidation: Resolver<ResolversTypes['UploadValidation'], ParentType, ContextType, RequireFields<MutationupdateUploadValidationArgs, 'id' | 'input'>>;
  updateUser: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationupdateUserArgs, 'id' | 'input'>>;
};

export type MutationRelationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createAgency?: RequiredResolverFn<ResolversTypes['Agency'], ParentType, ContextType, RequireFields<MutationcreateAgencyArgs, 'input'>>;
  createExpenditureCategory?: RequiredResolverFn<ResolversTypes['ExpenditureCategory'], ParentType, ContextType, RequireFields<MutationcreateExpenditureCategoryArgs, 'input'>>;
  createInputTemplate?: RequiredResolverFn<ResolversTypes['InputTemplate'], ParentType, ContextType, RequireFields<MutationcreateInputTemplateArgs, 'input'>>;
  createOrganization?: RequiredResolverFn<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationcreateOrganizationArgs, 'input'>>;
  createOutputTemplate?: RequiredResolverFn<ResolversTypes['OutputTemplate'], ParentType, ContextType, RequireFields<MutationcreateOutputTemplateArgs, 'input'>>;
  createProject?: RequiredResolverFn<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationcreateProjectArgs, 'input'>>;
  createReportingPeriod?: RequiredResolverFn<ResolversTypes['ReportingPeriod'], ParentType, ContextType, RequireFields<MutationcreateReportingPeriodArgs, 'input'>>;
  createRole?: RequiredResolverFn<ResolversTypes['Role'], ParentType, ContextType, RequireFields<MutationcreateRoleArgs, 'input'>>;
  createSubrecipient?: RequiredResolverFn<ResolversTypes['Subrecipient'], ParentType, ContextType, RequireFields<MutationcreateSubrecipientArgs, 'input'>>;
  createUpload?: RequiredResolverFn<ResolversTypes['Upload'], ParentType, ContextType, RequireFields<MutationcreateUploadArgs, 'input'>>;
  createUploadValidation?: RequiredResolverFn<ResolversTypes['UploadValidation'], ParentType, ContextType, RequireFields<MutationcreateUploadValidationArgs, 'input'>>;
  createUser?: RequiredResolverFn<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationcreateUserArgs, 'input'>>;
  deleteAgency?: RequiredResolverFn<ResolversTypes['Agency'], ParentType, ContextType, RequireFields<MutationdeleteAgencyArgs, 'id'>>;
  deleteExpenditureCategory?: RequiredResolverFn<ResolversTypes['ExpenditureCategory'], ParentType, ContextType, RequireFields<MutationdeleteExpenditureCategoryArgs, 'id'>>;
  deleteInputTemplate?: RequiredResolverFn<ResolversTypes['InputTemplate'], ParentType, ContextType, RequireFields<MutationdeleteInputTemplateArgs, 'id'>>;
  deleteOrganization?: RequiredResolverFn<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationdeleteOrganizationArgs, 'id'>>;
  deleteOutputTemplate?: RequiredResolverFn<ResolversTypes['OutputTemplate'], ParentType, ContextType, RequireFields<MutationdeleteOutputTemplateArgs, 'id'>>;
  deleteProject?: RequiredResolverFn<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationdeleteProjectArgs, 'id'>>;
  deleteReportingPeriod?: RequiredResolverFn<ResolversTypes['ReportingPeriod'], ParentType, ContextType, RequireFields<MutationdeleteReportingPeriodArgs, 'id'>>;
  deleteRole?: RequiredResolverFn<ResolversTypes['Role'], ParentType, ContextType, RequireFields<MutationdeleteRoleArgs, 'id'>>;
  deleteSubrecipient?: RequiredResolverFn<ResolversTypes['Subrecipient'], ParentType, ContextType, RequireFields<MutationdeleteSubrecipientArgs, 'id'>>;
  deleteUpload?: RequiredResolverFn<ResolversTypes['Upload'], ParentType, ContextType, RequireFields<MutationdeleteUploadArgs, 'id'>>;
  deleteUploadValidation?: RequiredResolverFn<ResolversTypes['UploadValidation'], ParentType, ContextType, RequireFields<MutationdeleteUploadValidationArgs, 'id'>>;
  deleteUser?: RequiredResolverFn<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationdeleteUserArgs, 'id'>>;
  updateAgency?: RequiredResolverFn<ResolversTypes['Agency'], ParentType, ContextType, RequireFields<MutationupdateAgencyArgs, 'id' | 'input'>>;
  updateExpenditureCategory?: RequiredResolverFn<ResolversTypes['ExpenditureCategory'], ParentType, ContextType, RequireFields<MutationupdateExpenditureCategoryArgs, 'id' | 'input'>>;
  updateInputTemplate?: RequiredResolverFn<ResolversTypes['InputTemplate'], ParentType, ContextType, RequireFields<MutationupdateInputTemplateArgs, 'id' | 'input'>>;
  updateOrganization?: RequiredResolverFn<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationupdateOrganizationArgs, 'id' | 'input'>>;
  updateOutputTemplate?: RequiredResolverFn<ResolversTypes['OutputTemplate'], ParentType, ContextType, RequireFields<MutationupdateOutputTemplateArgs, 'id' | 'input'>>;
  updateProject?: RequiredResolverFn<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationupdateProjectArgs, 'id' | 'input'>>;
  updateReportingPeriod?: RequiredResolverFn<ResolversTypes['ReportingPeriod'], ParentType, ContextType, RequireFields<MutationupdateReportingPeriodArgs, 'id' | 'input'>>;
  updateRole?: RequiredResolverFn<ResolversTypes['Role'], ParentType, ContextType, RequireFields<MutationupdateRoleArgs, 'id' | 'input'>>;
  updateSubrecipient?: RequiredResolverFn<ResolversTypes['Subrecipient'], ParentType, ContextType, RequireFields<MutationupdateSubrecipientArgs, 'id' | 'input'>>;
  updateUpload?: RequiredResolverFn<ResolversTypes['Upload'], ParentType, ContextType, RequireFields<MutationupdateUploadArgs, 'id' | 'input'>>;
  updateUploadValidation?: RequiredResolverFn<ResolversTypes['UploadValidation'], ParentType, ContextType, RequireFields<MutationupdateUploadValidationArgs, 'id' | 'input'>>;
  updateUser?: RequiredResolverFn<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationupdateUserArgs, 'id' | 'input'>>;
};

export type OrganizationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Organization'] = ResolversParentTypes['Organization']> = {
  agencies: OptArgsResolverFn<Array<Maybe<ResolversTypes['Agency']>>, ParentType, ContextType>;
  id: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  name: OptArgsResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrganizationRelationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Organization'] = ResolversParentTypes['Organization']> = {
  agencies?: RequiredResolverFn<Array<Maybe<ResolversTypes['Agency']>>, ParentType, ContextType>;
  id?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  name?: RequiredResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OutputTemplateResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['OutputTemplate'] = ResolversParentTypes['OutputTemplate']> = {
  createdAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  effectiveDate: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  id: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  name: OptArgsResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  reportingPeriods: OptArgsResolverFn<Array<Maybe<ResolversTypes['ReportingPeriod']>>, ParentType, ContextType>;
  rulesGeneratedAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  version: OptArgsResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OutputTemplateRelationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['OutputTemplate'] = ResolversParentTypes['OutputTemplate']> = {
  createdAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  effectiveDate?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  name?: RequiredResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  reportingPeriods?: RequiredResolverFn<Array<Maybe<ResolversTypes['ReportingPeriod']>>, ParentType, ContextType>;
  rulesGeneratedAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  version?: RequiredResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProjectResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Project'] = ResolversParentTypes['Project']> = {
  agency: OptArgsResolverFn<ResolversTypes['Agency'], ParentType, ContextType>;
  agencyId: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  code: OptArgsResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  description: OptArgsResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  id: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  name: OptArgsResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  organization: OptArgsResolverFn<ResolversTypes['Organization'], ParentType, ContextType>;
  organizationId: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  originationPeriod: OptArgsResolverFn<ResolversTypes['ReportingPeriod'], ParentType, ContextType>;
  originationPeriodId: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  status: OptArgsResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProjectRelationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Project'] = ResolversParentTypes['Project']> = {
  agency?: RequiredResolverFn<ResolversTypes['Agency'], ParentType, ContextType>;
  agencyId?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  code?: RequiredResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: RequiredResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  id?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  name?: RequiredResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  organization?: RequiredResolverFn<ResolversTypes['Organization'], ParentType, ContextType>;
  organizationId?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  originationPeriod?: RequiredResolverFn<ResolversTypes['ReportingPeriod'], ParentType, ContextType>;
  originationPeriodId?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  status?: RequiredResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  agencies: OptArgsResolverFn<Array<ResolversTypes['Agency']>, ParentType, ContextType>;
  agenciesByOrganization: Resolver<Array<ResolversTypes['Agency']>, ParentType, ContextType, RequireFields<QueryagenciesByOrganizationArgs, 'organizationId'>>;
  agency: Resolver<Maybe<ResolversTypes['Agency']>, ParentType, ContextType, RequireFields<QueryagencyArgs, 'id'>>;
  expenditureCategories: OptArgsResolverFn<Array<ResolversTypes['ExpenditureCategory']>, ParentType, ContextType>;
  expenditureCategory: Resolver<Maybe<ResolversTypes['ExpenditureCategory']>, ParentType, ContextType, RequireFields<QueryexpenditureCategoryArgs, 'id'>>;
  inputTemplate: Resolver<Maybe<ResolversTypes['InputTemplate']>, ParentType, ContextType, RequireFields<QueryinputTemplateArgs, 'id'>>;
  inputTemplates: OptArgsResolverFn<Array<ResolversTypes['InputTemplate']>, ParentType, ContextType>;
  organization: Resolver<Maybe<ResolversTypes['Organization']>, ParentType, ContextType, RequireFields<QueryorganizationArgs, 'id'>>;
  organizations: OptArgsResolverFn<Array<ResolversTypes['Organization']>, ParentType, ContextType>;
  outputTemplate: Resolver<Maybe<ResolversTypes['OutputTemplate']>, ParentType, ContextType, RequireFields<QueryoutputTemplateArgs, 'id'>>;
  outputTemplates: OptArgsResolverFn<Array<ResolversTypes['OutputTemplate']>, ParentType, ContextType>;
  previousReportingPeriods: Resolver<Array<ResolversTypes['ReportingPeriod']>, ParentType, ContextType, RequireFields<QuerypreviousReportingPeriodsArgs, 'id' | 'organizationId'>>;
  project: Resolver<Maybe<ResolversTypes['Project']>, ParentType, ContextType, RequireFields<QueryprojectArgs, 'id'>>;
  projects: OptArgsResolverFn<Array<ResolversTypes['Project']>, ParentType, ContextType>;
  redwood: OptArgsResolverFn<Maybe<ResolversTypes['Redwood']>, ParentType, ContextType>;
  reportingPeriod: Resolver<Maybe<ResolversTypes['ReportingPeriod']>, ParentType, ContextType, RequireFields<QueryreportingPeriodArgs, 'id'>>;
  reportingPeriods: OptArgsResolverFn<Array<ResolversTypes['ReportingPeriod']>, ParentType, ContextType>;
  reportingPeriodsByOrg: Resolver<Array<ResolversTypes['ReportingPeriod']>, ParentType, ContextType, RequireFields<QueryreportingPeriodsByOrgArgs, 'organizationId'>>;
  role: Resolver<Maybe<ResolversTypes['Role']>, ParentType, ContextType, RequireFields<QueryroleArgs, 'id'>>;
  roles: OptArgsResolverFn<Array<ResolversTypes['Role']>, ParentType, ContextType>;
  subrecipient: Resolver<Maybe<ResolversTypes['Subrecipient']>, ParentType, ContextType, RequireFields<QuerysubrecipientArgs, 'id'>>;
  subrecipients: OptArgsResolverFn<Array<ResolversTypes['Subrecipient']>, ParentType, ContextType>;
  upload: Resolver<Maybe<ResolversTypes['Upload']>, ParentType, ContextType, RequireFields<QueryuploadArgs, 'id'>>;
  uploadValidation: Resolver<Maybe<ResolversTypes['UploadValidation']>, ParentType, ContextType, RequireFields<QueryuploadValidationArgs, 'id'>>;
  uploadValidations: OptArgsResolverFn<Array<ResolversTypes['UploadValidation']>, ParentType, ContextType>;
  uploads: OptArgsResolverFn<Array<ResolversTypes['Upload']>, ParentType, ContextType>;
  user: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryuserArgs, 'id'>>;
  users: OptArgsResolverFn<Array<ResolversTypes['User']>, ParentType, ContextType>;
};

export type QueryRelationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  agencies?: RequiredResolverFn<Array<ResolversTypes['Agency']>, ParentType, ContextType>;
  agenciesByOrganization?: RequiredResolverFn<Array<ResolversTypes['Agency']>, ParentType, ContextType, RequireFields<QueryagenciesByOrganizationArgs, 'organizationId'>>;
  agency?: RequiredResolverFn<Maybe<ResolversTypes['Agency']>, ParentType, ContextType, RequireFields<QueryagencyArgs, 'id'>>;
  expenditureCategories?: RequiredResolverFn<Array<ResolversTypes['ExpenditureCategory']>, ParentType, ContextType>;
  expenditureCategory?: RequiredResolverFn<Maybe<ResolversTypes['ExpenditureCategory']>, ParentType, ContextType, RequireFields<QueryexpenditureCategoryArgs, 'id'>>;
  inputTemplate?: RequiredResolverFn<Maybe<ResolversTypes['InputTemplate']>, ParentType, ContextType, RequireFields<QueryinputTemplateArgs, 'id'>>;
  inputTemplates?: RequiredResolverFn<Array<ResolversTypes['InputTemplate']>, ParentType, ContextType>;
  organization?: RequiredResolverFn<Maybe<ResolversTypes['Organization']>, ParentType, ContextType, RequireFields<QueryorganizationArgs, 'id'>>;
  organizations?: RequiredResolverFn<Array<ResolversTypes['Organization']>, ParentType, ContextType>;
  outputTemplate?: RequiredResolverFn<Maybe<ResolversTypes['OutputTemplate']>, ParentType, ContextType, RequireFields<QueryoutputTemplateArgs, 'id'>>;
  outputTemplates?: RequiredResolverFn<Array<ResolversTypes['OutputTemplate']>, ParentType, ContextType>;
  previousReportingPeriods?: RequiredResolverFn<Array<ResolversTypes['ReportingPeriod']>, ParentType, ContextType, RequireFields<QuerypreviousReportingPeriodsArgs, 'id' | 'organizationId'>>;
  project?: RequiredResolverFn<Maybe<ResolversTypes['Project']>, ParentType, ContextType, RequireFields<QueryprojectArgs, 'id'>>;
  projects?: RequiredResolverFn<Array<ResolversTypes['Project']>, ParentType, ContextType>;
  redwood?: RequiredResolverFn<Maybe<ResolversTypes['Redwood']>, ParentType, ContextType>;
  reportingPeriod?: RequiredResolverFn<Maybe<ResolversTypes['ReportingPeriod']>, ParentType, ContextType, RequireFields<QueryreportingPeriodArgs, 'id'>>;
  reportingPeriods?: RequiredResolverFn<Array<ResolversTypes['ReportingPeriod']>, ParentType, ContextType>;
  reportingPeriodsByOrg?: RequiredResolverFn<Array<ResolversTypes['ReportingPeriod']>, ParentType, ContextType, RequireFields<QueryreportingPeriodsByOrgArgs, 'organizationId'>>;
  role?: RequiredResolverFn<Maybe<ResolversTypes['Role']>, ParentType, ContextType, RequireFields<QueryroleArgs, 'id'>>;
  roles?: RequiredResolverFn<Array<ResolversTypes['Role']>, ParentType, ContextType>;
  subrecipient?: RequiredResolverFn<Maybe<ResolversTypes['Subrecipient']>, ParentType, ContextType, RequireFields<QuerysubrecipientArgs, 'id'>>;
  subrecipients?: RequiredResolverFn<Array<ResolversTypes['Subrecipient']>, ParentType, ContextType>;
  upload?: RequiredResolverFn<Maybe<ResolversTypes['Upload']>, ParentType, ContextType, RequireFields<QueryuploadArgs, 'id'>>;
  uploadValidation?: RequiredResolverFn<Maybe<ResolversTypes['UploadValidation']>, ParentType, ContextType, RequireFields<QueryuploadValidationArgs, 'id'>>;
  uploadValidations?: RequiredResolverFn<Array<ResolversTypes['UploadValidation']>, ParentType, ContextType>;
  uploads?: RequiredResolverFn<Array<ResolversTypes['Upload']>, ParentType, ContextType>;
  user?: RequiredResolverFn<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryuserArgs, 'id'>>;
  users?: RequiredResolverFn<Array<ResolversTypes['User']>, ParentType, ContextType>;
};

export type RedwoodResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Redwood'] = ResolversParentTypes['Redwood']> = {
  currentUser: OptArgsResolverFn<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  prismaVersion: OptArgsResolverFn<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  version: OptArgsResolverFn<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RedwoodRelationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Redwood'] = ResolversParentTypes['Redwood']> = {
  currentUser?: RequiredResolverFn<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  prismaVersion?: RequiredResolverFn<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  version?: RequiredResolverFn<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReportingPeriodResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['ReportingPeriod'] = ResolversParentTypes['ReportingPeriod']> = {
  certifiedAt: OptArgsResolverFn<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  certifiedBy: OptArgsResolverFn<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  certifiedById: OptArgsResolverFn<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  createdAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  endDate: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  id: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  inputTemplate: OptArgsResolverFn<ResolversTypes['InputTemplate'], ParentType, ContextType>;
  inputTemplateId: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  isCurrentPeriod: OptArgsResolverFn<ResolversTypes['Boolean'], ParentType, ContextType>;
  name: OptArgsResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  outputTemplate: OptArgsResolverFn<ResolversTypes['OutputTemplate'], ParentType, ContextType>;
  outputTemplateId: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  startDate: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReportingPeriodRelationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['ReportingPeriod'] = ResolversParentTypes['ReportingPeriod']> = {
  certifiedAt?: RequiredResolverFn<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  certifiedBy?: RequiredResolverFn<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  certifiedById?: RequiredResolverFn<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  createdAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  endDate?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  inputTemplate?: RequiredResolverFn<ResolversTypes['InputTemplate'], ParentType, ContextType>;
  inputTemplateId?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  isCurrentPeriod?: RequiredResolverFn<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: RequiredResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  outputTemplate?: RequiredResolverFn<ResolversTypes['OutputTemplate'], ParentType, ContextType>;
  outputTemplateId?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  startDate?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoleResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Role'] = ResolversParentTypes['Role']> = {
  createdAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  id: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  name: OptArgsResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  users: OptArgsResolverFn<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoleRelationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Role'] = ResolversParentTypes['Role']> = {
  createdAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  name?: RequiredResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  users?: RequiredResolverFn<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubrecipientResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Subrecipient'] = ResolversParentTypes['Subrecipient']> = {
  certifiedAt: OptArgsResolverFn<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  certifiedBy: OptArgsResolverFn<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  certifiedById: OptArgsResolverFn<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  createdAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  endDate: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  id: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  name: OptArgsResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  organization: OptArgsResolverFn<ResolversTypes['Organization'], ParentType, ContextType>;
  organizationId: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  originationUpload: OptArgsResolverFn<ResolversTypes['Upload'], ParentType, ContextType>;
  originationUploadId: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  startDate: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubrecipientRelationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Subrecipient'] = ResolversParentTypes['Subrecipient']> = {
  certifiedAt?: RequiredResolverFn<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  certifiedBy?: RequiredResolverFn<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  certifiedById?: RequiredResolverFn<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  createdAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  endDate?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  name?: RequiredResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  organization?: RequiredResolverFn<ResolversTypes['Organization'], ParentType, ContextType>;
  organizationId?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  originationUpload?: RequiredResolverFn<ResolversTypes['Upload'], ParentType, ContextType>;
  originationUploadId?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  startDate?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface TimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Time'], any> {
  name: 'Time';
}

export type UploadResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Upload'] = ResolversParentTypes['Upload']> = {
  agency: OptArgsResolverFn<ResolversTypes['Agency'], ParentType, ContextType>;
  agencyId: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  expenditureCategory: OptArgsResolverFn<ResolversTypes['ExpenditureCategory'], ParentType, ContextType>;
  expenditureCategoryId: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  filename: OptArgsResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  id: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  organization: OptArgsResolverFn<ResolversTypes['Organization'], ParentType, ContextType>;
  organizationId: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  reportingPeriod: OptArgsResolverFn<ResolversTypes['ReportingPeriod'], ParentType, ContextType>;
  reportingPeriodId: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  uploadedBy: OptArgsResolverFn<ResolversTypes['User'], ParentType, ContextType>;
  uploadedById: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  validations: OptArgsResolverFn<Array<Maybe<ResolversTypes['UploadValidation']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UploadRelationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Upload'] = ResolversParentTypes['Upload']> = {
  agency?: RequiredResolverFn<ResolversTypes['Agency'], ParentType, ContextType>;
  agencyId?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  expenditureCategory?: RequiredResolverFn<ResolversTypes['ExpenditureCategory'], ParentType, ContextType>;
  expenditureCategoryId?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  filename?: RequiredResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  id?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  organization?: RequiredResolverFn<ResolversTypes['Organization'], ParentType, ContextType>;
  organizationId?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  reportingPeriod?: RequiredResolverFn<ResolversTypes['ReportingPeriod'], ParentType, ContextType>;
  reportingPeriodId?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  uploadedBy?: RequiredResolverFn<ResolversTypes['User'], ParentType, ContextType>;
  uploadedById?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  validations?: RequiredResolverFn<Array<Maybe<ResolversTypes['UploadValidation']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UploadValidationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['UploadValidation'] = ResolversParentTypes['UploadValidation']> = {
  agency: OptArgsResolverFn<ResolversTypes['Agency'], ParentType, ContextType>;
  agencyId: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  id: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  inputTemplate: OptArgsResolverFn<ResolversTypes['InputTemplate'], ParentType, ContextType>;
  inputTemplateId: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  invalidatedAt: OptArgsResolverFn<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  invalidatedBy: OptArgsResolverFn<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  invalidatedById: OptArgsResolverFn<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  invalidationResults: OptArgsResolverFn<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  organization: OptArgsResolverFn<ResolversTypes['Organization'], ParentType, ContextType>;
  organizationId: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  upload: OptArgsResolverFn<ResolversTypes['Upload'], ParentType, ContextType>;
  uploadId: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  validatedAt: OptArgsResolverFn<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  validatedBy: OptArgsResolverFn<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  validatedById: OptArgsResolverFn<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  validationResults: OptArgsResolverFn<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UploadValidationRelationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['UploadValidation'] = ResolversParentTypes['UploadValidation']> = {
  agency?: RequiredResolverFn<ResolversTypes['Agency'], ParentType, ContextType>;
  agencyId?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  inputTemplate?: RequiredResolverFn<ResolversTypes['InputTemplate'], ParentType, ContextType>;
  inputTemplateId?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  invalidatedAt?: RequiredResolverFn<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  invalidatedBy?: RequiredResolverFn<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  invalidatedById?: RequiredResolverFn<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  invalidationResults?: RequiredResolverFn<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  organization?: RequiredResolverFn<ResolversTypes['Organization'], ParentType, ContextType>;
  organizationId?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  upload?: RequiredResolverFn<ResolversTypes['Upload'], ParentType, ContextType>;
  uploadId?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  validatedAt?: RequiredResolverFn<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  validatedBy?: RequiredResolverFn<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  validatedById?: RequiredResolverFn<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  validationResults?: RequiredResolverFn<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  agency: OptArgsResolverFn<Maybe<ResolversTypes['Agency']>, ParentType, ContextType>;
  agencyId: OptArgsResolverFn<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  certified: OptArgsResolverFn<Array<Maybe<ResolversTypes['ReportingPeriod']>>, ParentType, ContextType>;
  createdAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  email: OptArgsResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  id: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  name: OptArgsResolverFn<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organization: OptArgsResolverFn<ResolversTypes['Organization'], ParentType, ContextType>;
  organizationId: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  role: OptArgsResolverFn<Maybe<ResolversTypes['Role']>, ParentType, ContextType>;
  roleId: OptArgsResolverFn<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updatedAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserRelationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  agency?: RequiredResolverFn<Maybe<ResolversTypes['Agency']>, ParentType, ContextType>;
  agencyId?: RequiredResolverFn<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  certified?: RequiredResolverFn<Array<Maybe<ResolversTypes['ReportingPeriod']>>, ParentType, ContextType>;
  createdAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: RequiredResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  id?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  name?: RequiredResolverFn<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organization?: RequiredResolverFn<ResolversTypes['Organization'], ParentType, ContextType>;
  organizationId?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  role?: RequiredResolverFn<Maybe<ResolversTypes['Role']>, ParentType, ContextType>;
  roleId?: RequiredResolverFn<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updatedAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = RedwoodGraphQLContext> = {
  Agency: AgencyResolvers<ContextType>;
  BigInt: GraphQLScalarType;
  Date: GraphQLScalarType;
  DateTime: GraphQLScalarType;
  ExpenditureCategory: ExpenditureCategoryResolvers<ContextType>;
  InputTemplate: InputTemplateResolvers<ContextType>;
  JSON: GraphQLScalarType;
  JSONObject: GraphQLScalarType;
  Mutation: MutationResolvers<ContextType>;
  Organization: OrganizationResolvers<ContextType>;
  OutputTemplate: OutputTemplateResolvers<ContextType>;
  Project: ProjectResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  Redwood: RedwoodResolvers<ContextType>;
  ReportingPeriod: ReportingPeriodResolvers<ContextType>;
  Role: RoleResolvers<ContextType>;
  Subrecipient: SubrecipientResolvers<ContextType>;
  Time: GraphQLScalarType;
  Upload: UploadResolvers<ContextType>;
  UploadValidation: UploadValidationResolvers<ContextType>;
  User: UserResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = RedwoodGraphQLContext> = {
  requireAuth: requireAuthDirectiveResolver<any, any, ContextType>;
  skipAuth: skipAuthDirectiveResolver<any, any, ContextType>;
};

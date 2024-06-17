import { Prisma } from "@prisma/client"
import { MergePrismaWithSdlTypes, MakeRelationsOptional } from '@redwoodjs/api'
import { Agency as PrismaAgency, Organization as PrismaOrganization, User as PrismaUser, InputTemplate as PrismaInputTemplate, OutputTemplate as PrismaOutputTemplate, ReportingPeriod as PrismaReportingPeriod, ExpenditureCategory as PrismaExpenditureCategory, Upload as PrismaUpload, UploadValidation as PrismaUploadValidation, Subrecipient as PrismaSubrecipient, SubrecipientUpload as PrismaSubrecipientUpload, Project as PrismaProject, ValidationRules as PrismaValidationRules } from '@prisma/client'
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
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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
  Byte: Buffer;
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
  organizationId: Scalars['Int'];
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

export type CreateOrgAgencyAdminInput = {
  agencyAbbreviation: Scalars['String'];
  agencyCode: Scalars['String'];
  agencyName: Scalars['String'];
  organizationName: Scalars['String'];
  userEmail: Scalars['String'];
  userName: Scalars['String'];
};

export type CreateOrgAgencyAdminPayload = {
  __typename?: 'CreateOrgAgencyAdminPayload';
  agency?: Maybe<Agency>;
  organization?: Maybe<Organization>;
  user?: Maybe<User>;
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
  endDate: Scalars['DateTime'];
  inputTemplateId: Scalars['Int'];
  name: Scalars['String'];
  organizationId: Scalars['Int'];
  outputTemplateId: Scalars['Int'];
  startDate: Scalars['DateTime'];
};

export type CreateSubrecipientInput = {
  name: Scalars['String'];
  organizationId: Scalars['Int'];
};

export type CreateSubrecipientUploadInput = {
  rawSubrecipient: Scalars['JSON'];
  subrecipientId: Scalars['Int'];
  ueiTinCombo: Scalars['String'];
  version: Version;
};

export type CreateUploadInput = {
  agencyId: Scalars['Int'];
  filename: Scalars['String'];
  reportingPeriodId: Scalars['Int'];
};

export type CreateUploadValidationInput = {
  initiatedById: Scalars['Int'];
  passed: Scalars['Boolean'];
  results?: InputMaybe<Scalars['JSON']>;
  uploadId: Scalars['Int'];
};

export type CreateUserInput = {
  agencyId: Scalars['Int'];
  email: Scalars['String'];
  isActive?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
  role: RoleEnum;
};

export type CreateValidationRulesInput = {
  versionId: Version;
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
  createOrganizationAgencyAdmin?: Maybe<CreateOrgAgencyAdminPayload>;
  createOutputTemplate: OutputTemplate;
  createProject: Project;
  createReportingPeriod: ReportingPeriod;
  createSubrecipient: Subrecipient;
  createSubrecipientUpload: SubrecipientUpload;
  createUpload: Upload;
  createUploadValidation: UploadValidation;
  createUser: User;
  createValidationRules: ValidationRules;
  deleteAgency: Agency;
  deleteExpenditureCategory: ExpenditureCategory;
  deleteInputTemplate: InputTemplate;
  deleteOrganization: Organization;
  deleteOutputTemplate: OutputTemplate;
  deleteProject: Project;
  deleteReportingPeriod: ReportingPeriod;
  deleteSubrecipient: Subrecipient;
  deleteSubrecipientUpload: SubrecipientUpload;
  deleteUpload: Upload;
  deleteUploadValidation: UploadValidation;
  deleteUser: User;
  deleteValidationRules: ValidationRules;
  downloadUploadFile: Scalars['String'];
  updateAgency: Agency;
  updateExpenditureCategory: ExpenditureCategory;
  updateInputTemplate: InputTemplate;
  updateOrganization: Organization;
  updateOutputTemplate: OutputTemplate;
  updateProject: Project;
  updateReportingPeriod: ReportingPeriod;
  updateSubrecipient: Subrecipient;
  updateSubrecipientUpload: SubrecipientUpload;
  updateUpload: Upload;
  updateUploadValidation: UploadValidation;
  updateUser: User;
  updateValidationRules: ValidationRules;
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


export type MutationcreateOrganizationAgencyAdminArgs = {
  input: CreateOrgAgencyAdminInput;
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


export type MutationcreateSubrecipientArgs = {
  input: CreateSubrecipientInput;
};


export type MutationcreateSubrecipientUploadArgs = {
  input: CreateSubrecipientUploadInput;
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


export type MutationcreateValidationRulesArgs = {
  input: CreateValidationRulesInput;
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


export type MutationdeleteSubrecipientArgs = {
  id: Scalars['Int'];
};


export type MutationdeleteSubrecipientUploadArgs = {
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


export type MutationdeleteValidationRulesArgs = {
  id: Scalars['Int'];
};


export type MutationdownloadUploadFileArgs = {
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


export type MutationupdateSubrecipientArgs = {
  id: Scalars['Int'];
  input: UpdateSubrecipientInput;
};


export type MutationupdateSubrecipientUploadArgs = {
  id: Scalars['Int'];
  input: UpdateSubrecipientUploadInput;
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


export type MutationupdateValidationRulesArgs = {
  id: Scalars['Int'];
  input: UpdateValidationRulesInput;
};

export type Organization = {
  __typename?: 'Organization';
  agencies: Array<Maybe<Agency>>;
  id: Scalars['Int'];
  name: Scalars['String'];
  preferences?: Maybe<Scalars['JSON']>;
  projects: Array<Maybe<Project>>;
  reportingPeriods: Array<Maybe<ReportingPeriod>>;
  subrecipients: Array<Maybe<Subrecipient>>;
  users: Array<Maybe<User>>;
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
  agenciesAvailableForUpload: Array<Agency>;
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
  project?: Maybe<Project>;
  projects: Array<Project>;
  /** Fetches the Redwood root schema. */
  redwood?: Maybe<Redwood>;
  reportingPeriod?: Maybe<ReportingPeriod>;
  reportingPeriods: Array<ReportingPeriod>;
  subrecipient?: Maybe<Subrecipient>;
  subrecipientUpload?: Maybe<SubrecipientUpload>;
  subrecipientUploads: Array<SubrecipientUpload>;
  subrecipients: Array<Subrecipient>;
  upload?: Maybe<Upload>;
  uploadValidation?: Maybe<UploadValidation>;
  uploadValidations: Array<UploadValidation>;
  uploads: Array<Upload>;
  user?: Maybe<User>;
  users: Array<User>;
  usersByOrganization: Array<User>;
  validationRules?: Maybe<ValidationRules>;
  validationRuleses: Array<ValidationRules>;
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
export type QueryprojectArgs = {
  id: Scalars['Int'];
};


/** About the Redwood queries. */
export type QueryreportingPeriodArgs = {
  id: Scalars['Int'];
};


/** About the Redwood queries. */
export type QuerysubrecipientArgs = {
  id: Scalars['Int'];
};


/** About the Redwood queries. */
export type QuerysubrecipientUploadArgs = {
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


/** About the Redwood queries. */
export type QueryusersByOrganizationArgs = {
  organizationId: Scalars['Int'];
};


/** About the Redwood queries. */
export type QueryvalidationRulesArgs = {
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
  createdAt: Scalars['DateTime'];
  endDate: Scalars['DateTime'];
  id: Scalars['Int'];
  inputTemplate: InputTemplate;
  inputTemplateId: Scalars['Int'];
  name: Scalars['String'];
  organization: Organization;
  organizationId: Scalars['Int'];
  outputTemplate: OutputTemplate;
  outputTemplateId: Scalars['Int'];
  projects: Array<Maybe<Project>>;
  startDate: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  uploads: Array<Maybe<Upload>>;
  validationRules?: Maybe<ValidationRules>;
  validationRulesId?: Maybe<Scalars['Int']>;
};

export type RoleEnum =
  | 'ORGANIZATION_ADMIN'
  | 'ORGANIZATION_STAFF'
  | 'USDR_ADMIN';

export type Subrecipient = {
  __typename?: 'Subrecipient';
  createdAt: Scalars['DateTime'];
  id: Scalars['Int'];
  name: Scalars['String'];
  organization: Organization;
  organizationId: Scalars['Int'];
  status?: Maybe<SubrecipientStatus>;
  subrecipientUploads?: Maybe<Array<Maybe<SubrecipientUpload>>>;
  updatedAt: Scalars['DateTime'];
};

export type SubrecipientStatus =
  | 'ACTIVE'
  | 'ARCHIVED';

export type SubrecipientUpload = {
  __typename?: 'SubrecipientUpload';
  createdAt: Scalars['DateTime'];
  id: Scalars['Int'];
  rawSubrecipient: Scalars['JSON'];
  subrecipient: Subrecipient;
  subrecipientId: Scalars['Int'];
  ueiTinCombo: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  version: Version;
};

export type UpdateAgencyInput = {
  abbreviation?: InputMaybe<Scalars['String']>;
  code?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  organizationId: Scalars['Int'];
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
  endDate?: InputMaybe<Scalars['DateTime']>;
  inputTemplateId?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  organizationId?: InputMaybe<Scalars['Int']>;
  outputTemplateId?: InputMaybe<Scalars['Int']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
};

export type UpdateSubrecipientInput = {
  name?: InputMaybe<Scalars['String']>;
  organizationId?: InputMaybe<Scalars['Int']>;
};

export type UpdateSubrecipientUploadInput = {
  rawSubrecipient?: InputMaybe<Scalars['JSON']>;
  subrecipientId?: InputMaybe<Scalars['Int']>;
  ueiTinCombo?: InputMaybe<Scalars['String']>;
  version?: InputMaybe<Version>;
};

export type UpdateUploadInput = {
  agencyId?: InputMaybe<Scalars['Int']>;
  expenditureCategoryId?: InputMaybe<Scalars['Int']>;
  filename?: InputMaybe<Scalars['String']>;
  reportingPeriodId?: InputMaybe<Scalars['Int']>;
  uploadedById?: InputMaybe<Scalars['Int']>;
};

export type UpdateUploadValidationInput = {
  initiatedById?: InputMaybe<Scalars['Int']>;
  passed?: InputMaybe<Scalars['Boolean']>;
  results?: InputMaybe<Scalars['JSON']>;
  uploadId?: InputMaybe<Scalars['Int']>;
};

export type UpdateUserInput = {
  agencyId?: InputMaybe<Scalars['Int']>;
  email?: InputMaybe<Scalars['String']>;
  isActive?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  role?: InputMaybe<RoleEnum>;
};

export type UpdateValidationRulesInput = {
  versionId?: InputMaybe<Version>;
};

export type Upload = {
  __typename?: 'Upload';
  agency: Agency;
  agencyId: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  expenditureCategory?: Maybe<ExpenditureCategory>;
  expenditureCategoryId?: Maybe<Scalars['Int']>;
  filename: Scalars['String'];
  id: Scalars['Int'];
  latestValidation?: Maybe<UploadValidation>;
  reportingPeriod: ReportingPeriod;
  reportingPeriodId: Scalars['Int'];
  signedUrl?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
  uploadedBy: User;
  uploadedById: Scalars['Int'];
  validations: Array<Maybe<UploadValidation>>;
};

export type UploadValidation = {
  __typename?: 'UploadValidation';
  createdAt: Scalars['DateTime'];
  id: Scalars['Int'];
  initiatedBy: User;
  initiatedById: Scalars['Int'];
  passed: Scalars['Boolean'];
  results?: Maybe<Scalars['JSON']>;
  updatedAt: Scalars['DateTime'];
  upload: Upload;
  uploadId: Scalars['Int'];
  validationRules?: Maybe<ValidationRules>;
  validationRulesId?: Maybe<Scalars['Int']>;
};

export type User = {
  __typename?: 'User';
  agency: Agency;
  agencyId: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  id: Scalars['Int'];
  name: Scalars['String'];
  role: RoleEnum;
  updatedAt: Scalars['DateTime'];
  uploaded: Array<Maybe<Upload>>;
};

export type ValidationRules = {
  __typename?: 'ValidationRules';
  createdAt: Scalars['DateTime'];
  id: Scalars['Int'];
  reportingPeriods: Array<Maybe<ReportingPeriod>>;
  updatedAt: Scalars['DateTime'];
  validations: Array<Maybe<UploadValidation>>;
  versionId: Version;
};

export type Version =
  | 'V2023_12_12'
  | 'V2024_01_07'
  | 'V2024_04_01'
  | 'V2024_05_24';

type MaybeOrArrayOfMaybe<T> = T | Maybe<T> | Maybe<T>[];
type AllMappedModels = MaybeOrArrayOfMaybe<Agency | ExpenditureCategory | InputTemplate | Organization | OutputTemplate | Project | ReportingPeriod | Subrecipient | SubrecipientUpload | Upload | UploadValidation | User | ValidationRules>


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
  Byte: ResolverTypeWrapper<Scalars['Byte']>;
  CreateAgencyInput: CreateAgencyInput;
  CreateExpenditureCategoryInput: CreateExpenditureCategoryInput;
  CreateInputTemplateInput: CreateInputTemplateInput;
  CreateOrgAgencyAdminInput: CreateOrgAgencyAdminInput;
  CreateOrgAgencyAdminPayload: ResolverTypeWrapper<Omit<CreateOrgAgencyAdminPayload, 'agency' | 'organization' | 'user'> & { agency: Maybe<ResolversTypes['Agency']>, organization: Maybe<ResolversTypes['Organization']>, user: Maybe<ResolversTypes['User']> }>;
  CreateOrganizationInput: CreateOrganizationInput;
  CreateOutputTemplateInput: CreateOutputTemplateInput;
  CreateProjectInput: CreateProjectInput;
  CreateReportingPeriodInput: CreateReportingPeriodInput;
  CreateSubrecipientInput: CreateSubrecipientInput;
  CreateSubrecipientUploadInput: CreateSubrecipientUploadInput;
  CreateUploadInput: CreateUploadInput;
  CreateUploadValidationInput: CreateUploadValidationInput;
  CreateUserInput: CreateUserInput;
  CreateValidationRulesInput: CreateValidationRulesInput;
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
  RoleEnum: RoleEnum;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subrecipient: ResolverTypeWrapper<MergePrismaWithSdlTypes<PrismaSubrecipient, MakeRelationsOptional<Subrecipient, AllMappedModels>, AllMappedModels>>;
  SubrecipientStatus: SubrecipientStatus;
  SubrecipientUpload: ResolverTypeWrapper<MergePrismaWithSdlTypes<PrismaSubrecipientUpload, MakeRelationsOptional<SubrecipientUpload, AllMappedModels>, AllMappedModels>>;
  Time: ResolverTypeWrapper<Scalars['Time']>;
  UpdateAgencyInput: UpdateAgencyInput;
  UpdateExpenditureCategoryInput: UpdateExpenditureCategoryInput;
  UpdateInputTemplateInput: UpdateInputTemplateInput;
  UpdateOrganizationInput: UpdateOrganizationInput;
  UpdateOutputTemplateInput: UpdateOutputTemplateInput;
  UpdateProjectInput: UpdateProjectInput;
  UpdateReportingPeriodInput: UpdateReportingPeriodInput;
  UpdateSubrecipientInput: UpdateSubrecipientInput;
  UpdateSubrecipientUploadInput: UpdateSubrecipientUploadInput;
  UpdateUploadInput: UpdateUploadInput;
  UpdateUploadValidationInput: UpdateUploadValidationInput;
  UpdateUserInput: UpdateUserInput;
  UpdateValidationRulesInput: UpdateValidationRulesInput;
  Upload: ResolverTypeWrapper<MergePrismaWithSdlTypes<PrismaUpload, MakeRelationsOptional<Upload, AllMappedModels>, AllMappedModels>>;
  UploadValidation: ResolverTypeWrapper<MergePrismaWithSdlTypes<PrismaUploadValidation, MakeRelationsOptional<UploadValidation, AllMappedModels>, AllMappedModels>>;
  User: ResolverTypeWrapper<MergePrismaWithSdlTypes<PrismaUser, MakeRelationsOptional<User, AllMappedModels>, AllMappedModels>>;
  ValidationRules: ResolverTypeWrapper<MergePrismaWithSdlTypes<PrismaValidationRules, MakeRelationsOptional<ValidationRules, AllMappedModels>, AllMappedModels>>;
  Version: Version;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Agency: MergePrismaWithSdlTypes<PrismaAgency, MakeRelationsOptional<Agency, AllMappedModels>, AllMappedModels>;
  BigInt: Scalars['BigInt'];
  Boolean: Scalars['Boolean'];
  Byte: Scalars['Byte'];
  CreateAgencyInput: CreateAgencyInput;
  CreateExpenditureCategoryInput: CreateExpenditureCategoryInput;
  CreateInputTemplateInput: CreateInputTemplateInput;
  CreateOrgAgencyAdminInput: CreateOrgAgencyAdminInput;
  CreateOrgAgencyAdminPayload: Omit<CreateOrgAgencyAdminPayload, 'agency' | 'organization' | 'user'> & { agency: Maybe<ResolversParentTypes['Agency']>, organization: Maybe<ResolversParentTypes['Organization']>, user: Maybe<ResolversParentTypes['User']> };
  CreateOrganizationInput: CreateOrganizationInput;
  CreateOutputTemplateInput: CreateOutputTemplateInput;
  CreateProjectInput: CreateProjectInput;
  CreateReportingPeriodInput: CreateReportingPeriodInput;
  CreateSubrecipientInput: CreateSubrecipientInput;
  CreateSubrecipientUploadInput: CreateSubrecipientUploadInput;
  CreateUploadInput: CreateUploadInput;
  CreateUploadValidationInput: CreateUploadValidationInput;
  CreateUserInput: CreateUserInput;
  CreateValidationRulesInput: CreateValidationRulesInput;
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
  String: Scalars['String'];
  Subrecipient: MergePrismaWithSdlTypes<PrismaSubrecipient, MakeRelationsOptional<Subrecipient, AllMappedModels>, AllMappedModels>;
  SubrecipientUpload: MergePrismaWithSdlTypes<PrismaSubrecipientUpload, MakeRelationsOptional<SubrecipientUpload, AllMappedModels>, AllMappedModels>;
  Time: Scalars['Time'];
  UpdateAgencyInput: UpdateAgencyInput;
  UpdateExpenditureCategoryInput: UpdateExpenditureCategoryInput;
  UpdateInputTemplateInput: UpdateInputTemplateInput;
  UpdateOrganizationInput: UpdateOrganizationInput;
  UpdateOutputTemplateInput: UpdateOutputTemplateInput;
  UpdateProjectInput: UpdateProjectInput;
  UpdateReportingPeriodInput: UpdateReportingPeriodInput;
  UpdateSubrecipientInput: UpdateSubrecipientInput;
  UpdateSubrecipientUploadInput: UpdateSubrecipientUploadInput;
  UpdateUploadInput: UpdateUploadInput;
  UpdateUploadValidationInput: UpdateUploadValidationInput;
  UpdateUserInput: UpdateUserInput;
  UpdateValidationRulesInput: UpdateValidationRulesInput;
  Upload: MergePrismaWithSdlTypes<PrismaUpload, MakeRelationsOptional<Upload, AllMappedModels>, AllMappedModels>;
  UploadValidation: MergePrismaWithSdlTypes<PrismaUploadValidation, MakeRelationsOptional<UploadValidation, AllMappedModels>, AllMappedModels>;
  User: MergePrismaWithSdlTypes<PrismaUser, MakeRelationsOptional<User, AllMappedModels>, AllMappedModels>;
  ValidationRules: MergePrismaWithSdlTypes<PrismaValidationRules, MakeRelationsOptional<ValidationRules, AllMappedModels>, AllMappedModels>;
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

export interface ByteScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Byte'], any> {
  name: 'Byte';
}

export type CreateOrgAgencyAdminPayloadResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['CreateOrgAgencyAdminPayload'] = ResolversParentTypes['CreateOrgAgencyAdminPayload']> = {
  agency: OptArgsResolverFn<Maybe<ResolversTypes['Agency']>, ParentType, ContextType>;
  organization: OptArgsResolverFn<Maybe<ResolversTypes['Organization']>, ParentType, ContextType>;
  user: OptArgsResolverFn<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateOrgAgencyAdminPayloadRelationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['CreateOrgAgencyAdminPayload'] = ResolversParentTypes['CreateOrgAgencyAdminPayload']> = {
  agency?: RequiredResolverFn<Maybe<ResolversTypes['Agency']>, ParentType, ContextType>;
  organization?: RequiredResolverFn<Maybe<ResolversTypes['Organization']>, ParentType, ContextType>;
  user?: RequiredResolverFn<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

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
  createOrganizationAgencyAdmin: Resolver<Maybe<ResolversTypes['CreateOrgAgencyAdminPayload']>, ParentType, ContextType, RequireFields<MutationcreateOrganizationAgencyAdminArgs, 'input'>>;
  createOutputTemplate: Resolver<ResolversTypes['OutputTemplate'], ParentType, ContextType, RequireFields<MutationcreateOutputTemplateArgs, 'input'>>;
  createProject: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationcreateProjectArgs, 'input'>>;
  createReportingPeriod: Resolver<ResolversTypes['ReportingPeriod'], ParentType, ContextType, RequireFields<MutationcreateReportingPeriodArgs, 'input'>>;
  createSubrecipient: Resolver<ResolversTypes['Subrecipient'], ParentType, ContextType, RequireFields<MutationcreateSubrecipientArgs, 'input'>>;
  createSubrecipientUpload: Resolver<ResolversTypes['SubrecipientUpload'], ParentType, ContextType, RequireFields<MutationcreateSubrecipientUploadArgs, 'input'>>;
  createUpload: Resolver<ResolversTypes['Upload'], ParentType, ContextType, RequireFields<MutationcreateUploadArgs, 'input'>>;
  createUploadValidation: Resolver<ResolversTypes['UploadValidation'], ParentType, ContextType, RequireFields<MutationcreateUploadValidationArgs, 'input'>>;
  createUser: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationcreateUserArgs, 'input'>>;
  createValidationRules: Resolver<ResolversTypes['ValidationRules'], ParentType, ContextType, RequireFields<MutationcreateValidationRulesArgs, 'input'>>;
  deleteAgency: Resolver<ResolversTypes['Agency'], ParentType, ContextType, RequireFields<MutationdeleteAgencyArgs, 'id'>>;
  deleteExpenditureCategory: Resolver<ResolversTypes['ExpenditureCategory'], ParentType, ContextType, RequireFields<MutationdeleteExpenditureCategoryArgs, 'id'>>;
  deleteInputTemplate: Resolver<ResolversTypes['InputTemplate'], ParentType, ContextType, RequireFields<MutationdeleteInputTemplateArgs, 'id'>>;
  deleteOrganization: Resolver<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationdeleteOrganizationArgs, 'id'>>;
  deleteOutputTemplate: Resolver<ResolversTypes['OutputTemplate'], ParentType, ContextType, RequireFields<MutationdeleteOutputTemplateArgs, 'id'>>;
  deleteProject: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationdeleteProjectArgs, 'id'>>;
  deleteReportingPeriod: Resolver<ResolversTypes['ReportingPeriod'], ParentType, ContextType, RequireFields<MutationdeleteReportingPeriodArgs, 'id'>>;
  deleteSubrecipient: Resolver<ResolversTypes['Subrecipient'], ParentType, ContextType, RequireFields<MutationdeleteSubrecipientArgs, 'id'>>;
  deleteSubrecipientUpload: Resolver<ResolversTypes['SubrecipientUpload'], ParentType, ContextType, RequireFields<MutationdeleteSubrecipientUploadArgs, 'id'>>;
  deleteUpload: Resolver<ResolversTypes['Upload'], ParentType, ContextType, RequireFields<MutationdeleteUploadArgs, 'id'>>;
  deleteUploadValidation: Resolver<ResolversTypes['UploadValidation'], ParentType, ContextType, RequireFields<MutationdeleteUploadValidationArgs, 'id'>>;
  deleteUser: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationdeleteUserArgs, 'id'>>;
  deleteValidationRules: Resolver<ResolversTypes['ValidationRules'], ParentType, ContextType, RequireFields<MutationdeleteValidationRulesArgs, 'id'>>;
  downloadUploadFile: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationdownloadUploadFileArgs, 'id'>>;
  updateAgency: Resolver<ResolversTypes['Agency'], ParentType, ContextType, RequireFields<MutationupdateAgencyArgs, 'id' | 'input'>>;
  updateExpenditureCategory: Resolver<ResolversTypes['ExpenditureCategory'], ParentType, ContextType, RequireFields<MutationupdateExpenditureCategoryArgs, 'id' | 'input'>>;
  updateInputTemplate: Resolver<ResolversTypes['InputTemplate'], ParentType, ContextType, RequireFields<MutationupdateInputTemplateArgs, 'id' | 'input'>>;
  updateOrganization: Resolver<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationupdateOrganizationArgs, 'id' | 'input'>>;
  updateOutputTemplate: Resolver<ResolversTypes['OutputTemplate'], ParentType, ContextType, RequireFields<MutationupdateOutputTemplateArgs, 'id' | 'input'>>;
  updateProject: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationupdateProjectArgs, 'id' | 'input'>>;
  updateReportingPeriod: Resolver<ResolversTypes['ReportingPeriod'], ParentType, ContextType, RequireFields<MutationupdateReportingPeriodArgs, 'id' | 'input'>>;
  updateSubrecipient: Resolver<ResolversTypes['Subrecipient'], ParentType, ContextType, RequireFields<MutationupdateSubrecipientArgs, 'id' | 'input'>>;
  updateSubrecipientUpload: Resolver<ResolversTypes['SubrecipientUpload'], ParentType, ContextType, RequireFields<MutationupdateSubrecipientUploadArgs, 'id' | 'input'>>;
  updateUpload: Resolver<ResolversTypes['Upload'], ParentType, ContextType, RequireFields<MutationupdateUploadArgs, 'id' | 'input'>>;
  updateUploadValidation: Resolver<ResolversTypes['UploadValidation'], ParentType, ContextType, RequireFields<MutationupdateUploadValidationArgs, 'id' | 'input'>>;
  updateUser: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationupdateUserArgs, 'id' | 'input'>>;
  updateValidationRules: Resolver<ResolversTypes['ValidationRules'], ParentType, ContextType, RequireFields<MutationupdateValidationRulesArgs, 'id' | 'input'>>;
};

export type MutationRelationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createAgency?: RequiredResolverFn<ResolversTypes['Agency'], ParentType, ContextType, RequireFields<MutationcreateAgencyArgs, 'input'>>;
  createExpenditureCategory?: RequiredResolverFn<ResolversTypes['ExpenditureCategory'], ParentType, ContextType, RequireFields<MutationcreateExpenditureCategoryArgs, 'input'>>;
  createInputTemplate?: RequiredResolverFn<ResolversTypes['InputTemplate'], ParentType, ContextType, RequireFields<MutationcreateInputTemplateArgs, 'input'>>;
  createOrganization?: RequiredResolverFn<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationcreateOrganizationArgs, 'input'>>;
  createOrganizationAgencyAdmin?: RequiredResolverFn<Maybe<ResolversTypes['CreateOrgAgencyAdminPayload']>, ParentType, ContextType, RequireFields<MutationcreateOrganizationAgencyAdminArgs, 'input'>>;
  createOutputTemplate?: RequiredResolverFn<ResolversTypes['OutputTemplate'], ParentType, ContextType, RequireFields<MutationcreateOutputTemplateArgs, 'input'>>;
  createProject?: RequiredResolverFn<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationcreateProjectArgs, 'input'>>;
  createReportingPeriod?: RequiredResolverFn<ResolversTypes['ReportingPeriod'], ParentType, ContextType, RequireFields<MutationcreateReportingPeriodArgs, 'input'>>;
  createSubrecipient?: RequiredResolverFn<ResolversTypes['Subrecipient'], ParentType, ContextType, RequireFields<MutationcreateSubrecipientArgs, 'input'>>;
  createSubrecipientUpload?: RequiredResolverFn<ResolversTypes['SubrecipientUpload'], ParentType, ContextType, RequireFields<MutationcreateSubrecipientUploadArgs, 'input'>>;
  createUpload?: RequiredResolverFn<ResolversTypes['Upload'], ParentType, ContextType, RequireFields<MutationcreateUploadArgs, 'input'>>;
  createUploadValidation?: RequiredResolverFn<ResolversTypes['UploadValidation'], ParentType, ContextType, RequireFields<MutationcreateUploadValidationArgs, 'input'>>;
  createUser?: RequiredResolverFn<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationcreateUserArgs, 'input'>>;
  createValidationRules?: RequiredResolverFn<ResolversTypes['ValidationRules'], ParentType, ContextType, RequireFields<MutationcreateValidationRulesArgs, 'input'>>;
  deleteAgency?: RequiredResolverFn<ResolversTypes['Agency'], ParentType, ContextType, RequireFields<MutationdeleteAgencyArgs, 'id'>>;
  deleteExpenditureCategory?: RequiredResolverFn<ResolversTypes['ExpenditureCategory'], ParentType, ContextType, RequireFields<MutationdeleteExpenditureCategoryArgs, 'id'>>;
  deleteInputTemplate?: RequiredResolverFn<ResolversTypes['InputTemplate'], ParentType, ContextType, RequireFields<MutationdeleteInputTemplateArgs, 'id'>>;
  deleteOrganization?: RequiredResolverFn<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationdeleteOrganizationArgs, 'id'>>;
  deleteOutputTemplate?: RequiredResolverFn<ResolversTypes['OutputTemplate'], ParentType, ContextType, RequireFields<MutationdeleteOutputTemplateArgs, 'id'>>;
  deleteProject?: RequiredResolverFn<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationdeleteProjectArgs, 'id'>>;
  deleteReportingPeriod?: RequiredResolverFn<ResolversTypes['ReportingPeriod'], ParentType, ContextType, RequireFields<MutationdeleteReportingPeriodArgs, 'id'>>;
  deleteSubrecipient?: RequiredResolverFn<ResolversTypes['Subrecipient'], ParentType, ContextType, RequireFields<MutationdeleteSubrecipientArgs, 'id'>>;
  deleteSubrecipientUpload?: RequiredResolverFn<ResolversTypes['SubrecipientUpload'], ParentType, ContextType, RequireFields<MutationdeleteSubrecipientUploadArgs, 'id'>>;
  deleteUpload?: RequiredResolverFn<ResolversTypes['Upload'], ParentType, ContextType, RequireFields<MutationdeleteUploadArgs, 'id'>>;
  deleteUploadValidation?: RequiredResolverFn<ResolversTypes['UploadValidation'], ParentType, ContextType, RequireFields<MutationdeleteUploadValidationArgs, 'id'>>;
  deleteUser?: RequiredResolverFn<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationdeleteUserArgs, 'id'>>;
  deleteValidationRules?: RequiredResolverFn<ResolversTypes['ValidationRules'], ParentType, ContextType, RequireFields<MutationdeleteValidationRulesArgs, 'id'>>;
  downloadUploadFile?: RequiredResolverFn<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationdownloadUploadFileArgs, 'id'>>;
  updateAgency?: RequiredResolverFn<ResolversTypes['Agency'], ParentType, ContextType, RequireFields<MutationupdateAgencyArgs, 'id' | 'input'>>;
  updateExpenditureCategory?: RequiredResolverFn<ResolversTypes['ExpenditureCategory'], ParentType, ContextType, RequireFields<MutationupdateExpenditureCategoryArgs, 'id' | 'input'>>;
  updateInputTemplate?: RequiredResolverFn<ResolversTypes['InputTemplate'], ParentType, ContextType, RequireFields<MutationupdateInputTemplateArgs, 'id' | 'input'>>;
  updateOrganization?: RequiredResolverFn<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationupdateOrganizationArgs, 'id' | 'input'>>;
  updateOutputTemplate?: RequiredResolverFn<ResolversTypes['OutputTemplate'], ParentType, ContextType, RequireFields<MutationupdateOutputTemplateArgs, 'id' | 'input'>>;
  updateProject?: RequiredResolverFn<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationupdateProjectArgs, 'id' | 'input'>>;
  updateReportingPeriod?: RequiredResolverFn<ResolversTypes['ReportingPeriod'], ParentType, ContextType, RequireFields<MutationupdateReportingPeriodArgs, 'id' | 'input'>>;
  updateSubrecipient?: RequiredResolverFn<ResolversTypes['Subrecipient'], ParentType, ContextType, RequireFields<MutationupdateSubrecipientArgs, 'id' | 'input'>>;
  updateSubrecipientUpload?: RequiredResolverFn<ResolversTypes['SubrecipientUpload'], ParentType, ContextType, RequireFields<MutationupdateSubrecipientUploadArgs, 'id' | 'input'>>;
  updateUpload?: RequiredResolverFn<ResolversTypes['Upload'], ParentType, ContextType, RequireFields<MutationupdateUploadArgs, 'id' | 'input'>>;
  updateUploadValidation?: RequiredResolverFn<ResolversTypes['UploadValidation'], ParentType, ContextType, RequireFields<MutationupdateUploadValidationArgs, 'id' | 'input'>>;
  updateUser?: RequiredResolverFn<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationupdateUserArgs, 'id' | 'input'>>;
  updateValidationRules?: RequiredResolverFn<ResolversTypes['ValidationRules'], ParentType, ContextType, RequireFields<MutationupdateValidationRulesArgs, 'id' | 'input'>>;
};

export type OrganizationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Organization'] = ResolversParentTypes['Organization']> = {
  agencies: OptArgsResolverFn<Array<Maybe<ResolversTypes['Agency']>>, ParentType, ContextType>;
  id: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  name: OptArgsResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  preferences: OptArgsResolverFn<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  projects: OptArgsResolverFn<Array<Maybe<ResolversTypes['Project']>>, ParentType, ContextType>;
  reportingPeriods: OptArgsResolverFn<Array<Maybe<ResolversTypes['ReportingPeriod']>>, ParentType, ContextType>;
  subrecipients: OptArgsResolverFn<Array<Maybe<ResolversTypes['Subrecipient']>>, ParentType, ContextType>;
  users: OptArgsResolverFn<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrganizationRelationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Organization'] = ResolversParentTypes['Organization']> = {
  agencies?: RequiredResolverFn<Array<Maybe<ResolversTypes['Agency']>>, ParentType, ContextType>;
  id?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  name?: RequiredResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  preferences?: RequiredResolverFn<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  projects?: RequiredResolverFn<Array<Maybe<ResolversTypes['Project']>>, ParentType, ContextType>;
  reportingPeriods?: RequiredResolverFn<Array<Maybe<ResolversTypes['ReportingPeriod']>>, ParentType, ContextType>;
  subrecipients?: RequiredResolverFn<Array<Maybe<ResolversTypes['Subrecipient']>>, ParentType, ContextType>;
  users?: RequiredResolverFn<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType>;
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
  agenciesAvailableForUpload: OptArgsResolverFn<Array<ResolversTypes['Agency']>, ParentType, ContextType>;
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
  project: Resolver<Maybe<ResolversTypes['Project']>, ParentType, ContextType, RequireFields<QueryprojectArgs, 'id'>>;
  projects: OptArgsResolverFn<Array<ResolversTypes['Project']>, ParentType, ContextType>;
  redwood: OptArgsResolverFn<Maybe<ResolversTypes['Redwood']>, ParentType, ContextType>;
  reportingPeriod: Resolver<Maybe<ResolversTypes['ReportingPeriod']>, ParentType, ContextType, RequireFields<QueryreportingPeriodArgs, 'id'>>;
  reportingPeriods: OptArgsResolverFn<Array<ResolversTypes['ReportingPeriod']>, ParentType, ContextType>;
  subrecipient: Resolver<Maybe<ResolversTypes['Subrecipient']>, ParentType, ContextType, RequireFields<QuerysubrecipientArgs, 'id'>>;
  subrecipientUpload: Resolver<Maybe<ResolversTypes['SubrecipientUpload']>, ParentType, ContextType, RequireFields<QuerysubrecipientUploadArgs, 'id'>>;
  subrecipientUploads: OptArgsResolverFn<Array<ResolversTypes['SubrecipientUpload']>, ParentType, ContextType>;
  subrecipients: OptArgsResolverFn<Array<ResolversTypes['Subrecipient']>, ParentType, ContextType>;
  upload: Resolver<Maybe<ResolversTypes['Upload']>, ParentType, ContextType, RequireFields<QueryuploadArgs, 'id'>>;
  uploadValidation: Resolver<Maybe<ResolversTypes['UploadValidation']>, ParentType, ContextType, RequireFields<QueryuploadValidationArgs, 'id'>>;
  uploadValidations: OptArgsResolverFn<Array<ResolversTypes['UploadValidation']>, ParentType, ContextType>;
  uploads: OptArgsResolverFn<Array<ResolversTypes['Upload']>, ParentType, ContextType>;
  user: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryuserArgs, 'id'>>;
  users: OptArgsResolverFn<Array<ResolversTypes['User']>, ParentType, ContextType>;
  usersByOrganization: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryusersByOrganizationArgs, 'organizationId'>>;
  validationRules: Resolver<Maybe<ResolversTypes['ValidationRules']>, ParentType, ContextType, RequireFields<QueryvalidationRulesArgs, 'id'>>;
  validationRuleses: OptArgsResolverFn<Array<ResolversTypes['ValidationRules']>, ParentType, ContextType>;
};

export type QueryRelationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  agencies?: RequiredResolverFn<Array<ResolversTypes['Agency']>, ParentType, ContextType>;
  agenciesAvailableForUpload?: RequiredResolverFn<Array<ResolversTypes['Agency']>, ParentType, ContextType>;
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
  project?: RequiredResolverFn<Maybe<ResolversTypes['Project']>, ParentType, ContextType, RequireFields<QueryprojectArgs, 'id'>>;
  projects?: RequiredResolverFn<Array<ResolversTypes['Project']>, ParentType, ContextType>;
  redwood?: RequiredResolverFn<Maybe<ResolversTypes['Redwood']>, ParentType, ContextType>;
  reportingPeriod?: RequiredResolverFn<Maybe<ResolversTypes['ReportingPeriod']>, ParentType, ContextType, RequireFields<QueryreportingPeriodArgs, 'id'>>;
  reportingPeriods?: RequiredResolverFn<Array<ResolversTypes['ReportingPeriod']>, ParentType, ContextType>;
  subrecipient?: RequiredResolverFn<Maybe<ResolversTypes['Subrecipient']>, ParentType, ContextType, RequireFields<QuerysubrecipientArgs, 'id'>>;
  subrecipientUpload?: RequiredResolverFn<Maybe<ResolversTypes['SubrecipientUpload']>, ParentType, ContextType, RequireFields<QuerysubrecipientUploadArgs, 'id'>>;
  subrecipientUploads?: RequiredResolverFn<Array<ResolversTypes['SubrecipientUpload']>, ParentType, ContextType>;
  subrecipients?: RequiredResolverFn<Array<ResolversTypes['Subrecipient']>, ParentType, ContextType>;
  upload?: RequiredResolverFn<Maybe<ResolversTypes['Upload']>, ParentType, ContextType, RequireFields<QueryuploadArgs, 'id'>>;
  uploadValidation?: RequiredResolverFn<Maybe<ResolversTypes['UploadValidation']>, ParentType, ContextType, RequireFields<QueryuploadValidationArgs, 'id'>>;
  uploadValidations?: RequiredResolverFn<Array<ResolversTypes['UploadValidation']>, ParentType, ContextType>;
  uploads?: RequiredResolverFn<Array<ResolversTypes['Upload']>, ParentType, ContextType>;
  user?: RequiredResolverFn<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryuserArgs, 'id'>>;
  users?: RequiredResolverFn<Array<ResolversTypes['User']>, ParentType, ContextType>;
  usersByOrganization?: RequiredResolverFn<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryusersByOrganizationArgs, 'organizationId'>>;
  validationRules?: RequiredResolverFn<Maybe<ResolversTypes['ValidationRules']>, ParentType, ContextType, RequireFields<QueryvalidationRulesArgs, 'id'>>;
  validationRuleses?: RequiredResolverFn<Array<ResolversTypes['ValidationRules']>, ParentType, ContextType>;
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
  createdAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  endDate: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  id: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  inputTemplate: OptArgsResolverFn<ResolversTypes['InputTemplate'], ParentType, ContextType>;
  inputTemplateId: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  name: OptArgsResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  organization: OptArgsResolverFn<ResolversTypes['Organization'], ParentType, ContextType>;
  organizationId: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  outputTemplate: OptArgsResolverFn<ResolversTypes['OutputTemplate'], ParentType, ContextType>;
  outputTemplateId: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  projects: OptArgsResolverFn<Array<Maybe<ResolversTypes['Project']>>, ParentType, ContextType>;
  startDate: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  uploads: OptArgsResolverFn<Array<Maybe<ResolversTypes['Upload']>>, ParentType, ContextType>;
  validationRules: OptArgsResolverFn<Maybe<ResolversTypes['ValidationRules']>, ParentType, ContextType>;
  validationRulesId: OptArgsResolverFn<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReportingPeriodRelationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['ReportingPeriod'] = ResolversParentTypes['ReportingPeriod']> = {
  createdAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  endDate?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  inputTemplate?: RequiredResolverFn<ResolversTypes['InputTemplate'], ParentType, ContextType>;
  inputTemplateId?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  name?: RequiredResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  organization?: RequiredResolverFn<ResolversTypes['Organization'], ParentType, ContextType>;
  organizationId?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  outputTemplate?: RequiredResolverFn<ResolversTypes['OutputTemplate'], ParentType, ContextType>;
  outputTemplateId?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  projects?: RequiredResolverFn<Array<Maybe<ResolversTypes['Project']>>, ParentType, ContextType>;
  startDate?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  uploads?: RequiredResolverFn<Array<Maybe<ResolversTypes['Upload']>>, ParentType, ContextType>;
  validationRules?: RequiredResolverFn<Maybe<ResolversTypes['ValidationRules']>, ParentType, ContextType>;
  validationRulesId?: RequiredResolverFn<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubrecipientResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Subrecipient'] = ResolversParentTypes['Subrecipient']> = {
  createdAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  id: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  name: OptArgsResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  organization: OptArgsResolverFn<ResolversTypes['Organization'], ParentType, ContextType>;
  organizationId: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  status: OptArgsResolverFn<Maybe<ResolversTypes['SubrecipientStatus']>, ParentType, ContextType>;
  subrecipientUploads: OptArgsResolverFn<Maybe<Array<Maybe<ResolversTypes['SubrecipientUpload']>>>, ParentType, ContextType>;
  updatedAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubrecipientRelationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Subrecipient'] = ResolversParentTypes['Subrecipient']> = {
  createdAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  name?: RequiredResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  organization?: RequiredResolverFn<ResolversTypes['Organization'], ParentType, ContextType>;
  organizationId?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  status?: RequiredResolverFn<Maybe<ResolversTypes['SubrecipientStatus']>, ParentType, ContextType>;
  subrecipientUploads?: RequiredResolverFn<Maybe<Array<Maybe<ResolversTypes['SubrecipientUpload']>>>, ParentType, ContextType>;
  updatedAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubrecipientUploadResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['SubrecipientUpload'] = ResolversParentTypes['SubrecipientUpload']> = {
  createdAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  id: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  rawSubrecipient: OptArgsResolverFn<ResolversTypes['JSON'], ParentType, ContextType>;
  subrecipient: OptArgsResolverFn<ResolversTypes['Subrecipient'], ParentType, ContextType>;
  subrecipientId: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  ueiTinCombo: OptArgsResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  version: OptArgsResolverFn<ResolversTypes['Version'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubrecipientUploadRelationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['SubrecipientUpload'] = ResolversParentTypes['SubrecipientUpload']> = {
  createdAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  rawSubrecipient?: RequiredResolverFn<ResolversTypes['JSON'], ParentType, ContextType>;
  subrecipient?: RequiredResolverFn<ResolversTypes['Subrecipient'], ParentType, ContextType>;
  subrecipientId?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  ueiTinCombo?: RequiredResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  version?: RequiredResolverFn<ResolversTypes['Version'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface TimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Time'], any> {
  name: 'Time';
}

export type UploadResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Upload'] = ResolversParentTypes['Upload']> = {
  agency: OptArgsResolverFn<ResolversTypes['Agency'], ParentType, ContextType>;
  agencyId: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  expenditureCategory: OptArgsResolverFn<Maybe<ResolversTypes['ExpenditureCategory']>, ParentType, ContextType>;
  expenditureCategoryId: OptArgsResolverFn<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  filename: OptArgsResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  id: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  latestValidation: OptArgsResolverFn<Maybe<ResolversTypes['UploadValidation']>, ParentType, ContextType>;
  reportingPeriod: OptArgsResolverFn<ResolversTypes['ReportingPeriod'], ParentType, ContextType>;
  reportingPeriodId: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  signedUrl: OptArgsResolverFn<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  expenditureCategory?: RequiredResolverFn<Maybe<ResolversTypes['ExpenditureCategory']>, ParentType, ContextType>;
  expenditureCategoryId?: RequiredResolverFn<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  filename?: RequiredResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  id?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  latestValidation?: RequiredResolverFn<Maybe<ResolversTypes['UploadValidation']>, ParentType, ContextType>;
  reportingPeriod?: RequiredResolverFn<ResolversTypes['ReportingPeriod'], ParentType, ContextType>;
  reportingPeriodId?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  signedUrl?: RequiredResolverFn<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  uploadedBy?: RequiredResolverFn<ResolversTypes['User'], ParentType, ContextType>;
  uploadedById?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  validations?: RequiredResolverFn<Array<Maybe<ResolversTypes['UploadValidation']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UploadValidationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['UploadValidation'] = ResolversParentTypes['UploadValidation']> = {
  createdAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  id: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  initiatedBy: OptArgsResolverFn<ResolversTypes['User'], ParentType, ContextType>;
  initiatedById: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  passed: OptArgsResolverFn<ResolversTypes['Boolean'], ParentType, ContextType>;
  results: OptArgsResolverFn<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  updatedAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  upload: OptArgsResolverFn<ResolversTypes['Upload'], ParentType, ContextType>;
  uploadId: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  validationRules: OptArgsResolverFn<Maybe<ResolversTypes['ValidationRules']>, ParentType, ContextType>;
  validationRulesId: OptArgsResolverFn<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UploadValidationRelationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['UploadValidation'] = ResolversParentTypes['UploadValidation']> = {
  createdAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  initiatedBy?: RequiredResolverFn<ResolversTypes['User'], ParentType, ContextType>;
  initiatedById?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  passed?: RequiredResolverFn<ResolversTypes['Boolean'], ParentType, ContextType>;
  results?: RequiredResolverFn<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  updatedAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  upload?: RequiredResolverFn<ResolversTypes['Upload'], ParentType, ContextType>;
  uploadId?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  validationRules?: RequiredResolverFn<Maybe<ResolversTypes['ValidationRules']>, ParentType, ContextType>;
  validationRulesId?: RequiredResolverFn<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  agency: OptArgsResolverFn<ResolversTypes['Agency'], ParentType, ContextType>;
  agencyId: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  email: OptArgsResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  id: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  name: OptArgsResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  role: OptArgsResolverFn<ResolversTypes['RoleEnum'], ParentType, ContextType>;
  updatedAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  uploaded: OptArgsResolverFn<Array<Maybe<ResolversTypes['Upload']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserRelationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  agency?: RequiredResolverFn<ResolversTypes['Agency'], ParentType, ContextType>;
  agencyId?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: RequiredResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  id?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  name?: RequiredResolverFn<ResolversTypes['String'], ParentType, ContextType>;
  role?: RequiredResolverFn<ResolversTypes['RoleEnum'], ParentType, ContextType>;
  updatedAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  uploaded?: RequiredResolverFn<Array<Maybe<ResolversTypes['Upload']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ValidationRulesResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['ValidationRules'] = ResolversParentTypes['ValidationRules']> = {
  createdAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  id: OptArgsResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  reportingPeriods: OptArgsResolverFn<Array<Maybe<ResolversTypes['ReportingPeriod']>>, ParentType, ContextType>;
  updatedAt: OptArgsResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  validations: OptArgsResolverFn<Array<Maybe<ResolversTypes['UploadValidation']>>, ParentType, ContextType>;
  versionId: OptArgsResolverFn<ResolversTypes['Version'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ValidationRulesRelationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['ValidationRules'] = ResolversParentTypes['ValidationRules']> = {
  createdAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: RequiredResolverFn<ResolversTypes['Int'], ParentType, ContextType>;
  reportingPeriods?: RequiredResolverFn<Array<Maybe<ResolversTypes['ReportingPeriod']>>, ParentType, ContextType>;
  updatedAt?: RequiredResolverFn<ResolversTypes['DateTime'], ParentType, ContextType>;
  validations?: RequiredResolverFn<Array<Maybe<ResolversTypes['UploadValidation']>>, ParentType, ContextType>;
  versionId?: RequiredResolverFn<ResolversTypes['Version'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = RedwoodGraphQLContext> = {
  Agency: AgencyResolvers<ContextType>;
  BigInt: GraphQLScalarType;
  Byte: GraphQLScalarType;
  CreateOrgAgencyAdminPayload: CreateOrgAgencyAdminPayloadResolvers<ContextType>;
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
  Subrecipient: SubrecipientResolvers<ContextType>;
  SubrecipientUpload: SubrecipientUploadResolvers<ContextType>;
  Time: GraphQLScalarType;
  Upload: UploadResolvers<ContextType>;
  UploadValidation: UploadValidationResolvers<ContextType>;
  User: UserResolvers<ContextType>;
  ValidationRules: ValidationRulesResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = RedwoodGraphQLContext> = {
  requireAuth: requireAuthDirectiveResolver<any, any, ContextType>;
  skipAuth: skipAuthDirectiveResolver<any, any, ContextType>;
};

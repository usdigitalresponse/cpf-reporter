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
  usersByOrganization: Array<User>;
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


/** About the Redwood queries. */
export type QueryusersByOrganizationArgs = {
  organizationId: Scalars['Int'];
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
  invalidated: Array<Maybe<UploadValidation>>;
  name?: Maybe<Scalars['String']>;
  organization: Organization;
  organizationId: Scalars['Int'];
  role?: Maybe<Role>;
  roleId?: Maybe<Scalars['Int']>;
  updatedAt: Scalars['DateTime'];
  uploaded: Array<Maybe<Upload>>;
  validated: Array<Maybe<UploadValidation>>;
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

export type EditUploadByIdVariables = Exact<{
  id: Scalars['Int'];
}>;


export type EditUploadById = { __typename?: 'Query', upload?: { __typename?: 'Upload', id: number, filename: string, uploadedById: number, agencyId: number, organizationId: number, reportingPeriodId: number, expenditureCategoryId: number, createdAt: string, updatedAt: string } | null };

export type UpdateUploadMutationVariables = Exact<{
  id: Scalars['Int'];
  input: UpdateUploadInput;
}>;


export type UpdateUploadMutation = { __typename?: 'Mutation', updateUpload: { __typename?: 'Upload', id: number, filename: string, uploadedById: number, agencyId: number, organizationId: number, reportingPeriodId: number, expenditureCategoryId: number, createdAt: string, updatedAt: string } };

export type CreateUploadMutationVariables = Exact<{
  input: CreateUploadInput;
}>;


export type CreateUploadMutation = { __typename?: 'Mutation', createUpload: { __typename?: 'Upload', id: number } };

export type DeleteUploadMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteUploadMutation = { __typename?: 'Mutation', deleteUpload: { __typename?: 'Upload', id: number } };

export type FindUploadByIdVariables = Exact<{
  id: Scalars['Int'];
}>;


export type FindUploadById = { __typename?: 'Query', upload?: { __typename?: 'Upload', id: number, filename: string, uploadedById: number, agencyId: number, organizationId: number, reportingPeriodId: number, expenditureCategoryId: number, createdAt: string, updatedAt: string } | null };

export type FindUploadsVariables = Exact<{ [key: string]: never; }>;


export type FindUploads = { __typename?: 'Query', uploads: Array<{ __typename?: 'Upload', id: number, filename: string, createdAt: string, updatedAt: string, uploadedBy: { __typename?: 'User', id: number, email: string }, agency: { __typename?: 'Agency', id: number, code: string }, expenditureCategory: { __typename?: 'ExpenditureCategory', id: number, code: string }, validations: Array<{ __typename?: 'UploadValidation', invalidatedAt?: string | null, validatedAt?: string | null } | null> }> };

export type EditUserByIdVariables = Exact<{
  id: Scalars['Int'];
}>;


export type EditUserById = { __typename?: 'Query', user?: { __typename?: 'User', id: number, email: string, name?: string | null, agencyId?: number | null, organizationId: number, roleId?: number | null, createdAt: string, updatedAt: string } | null };

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['Int'];
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: number, email: string, name?: string | null, agencyId?: number | null, organizationId: number, roleId?: number | null, createdAt: string, updatedAt: string } };

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', id: number } };

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: { __typename?: 'User', id: number } };

export type FindUserByIdVariables = Exact<{
  id: Scalars['Int'];
}>;


export type FindUserById = { __typename?: 'Query', user?: { __typename?: 'User', id: number, email: string, name?: string | null, agencyId?: number | null, organizationId: number, roleId?: number | null, createdAt: string, updatedAt: string } | null };

export type FindUsersByOrganizationIdVariables = Exact<{
  organizationId: Scalars['Int'];
}>;


export type FindUsersByOrganizationId = { __typename?: 'Query', usersByOrganization: Array<{ __typename?: 'User', id: number, email: string, name?: string | null, agencyId?: number | null, organizationId: number, roleId?: number | null, createdAt: string, updatedAt: string }> };

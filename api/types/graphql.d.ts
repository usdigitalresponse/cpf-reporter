import { Prisma } from "@prisma/client"
import { MergePrismaWithSdlTypes, MakeRelationsOptional } from '@redwoodjs/api'
import { InputTemplate as PrismaInputTemplate, OutputTemplate as PrismaOutputTemplate, ReportingPeriod as PrismaReportingPeriod } from '@prisma/client'
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
  certifiedBy?: InputMaybe<Scalars['String']>;
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
  certifiedBy?: Maybe<Scalars['String']>;
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
  certifiedBy?: InputMaybe<Scalars['String']>;
  endDate?: InputMaybe<Scalars['DateTime']>;
  inputTemplateId?: InputMaybe<Scalars['Int']>;
  isCurrentPeriod?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  outputTemplateId?: InputMaybe<Scalars['Int']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
};

type MaybeOrArrayOfMaybe<T> = T | Maybe<T> | Maybe<T>[];
type AllMappedModels = MaybeOrArrayOfMaybe<InputTemplate | OutputTemplate | ReportingPeriod>


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
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CreateInputTemplateInput: CreateInputTemplateInput;
  CreateOutputTemplateInput: CreateOutputTemplateInput;
  CreateReportingPeriodInput: CreateReportingPeriodInput;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  InputTemplate: ResolverTypeWrapper<MergePrismaWithSdlTypes<PrismaInputTemplate, MakeRelationsOptional<InputTemplate, AllMappedModels>, AllMappedModels>>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']>;
  Mutation: ResolverTypeWrapper<{}>;
  OutputTemplate: ResolverTypeWrapper<MergePrismaWithSdlTypes<PrismaOutputTemplate, MakeRelationsOptional<OutputTemplate, AllMappedModels>, AllMappedModels>>;
  Query: ResolverTypeWrapper<{}>;
  Redwood: ResolverTypeWrapper<Redwood>;
  ReportingPeriod: ResolverTypeWrapper<MergePrismaWithSdlTypes<PrismaReportingPeriod, MakeRelationsOptional<ReportingPeriod, AllMappedModels>, AllMappedModels>>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Time: ResolverTypeWrapper<Scalars['Time']>;
  UpdateInputTemplateInput: UpdateInputTemplateInput;
  UpdateOutputTemplateInput: UpdateOutputTemplateInput;
  UpdateReportingPeriodInput: UpdateReportingPeriodInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  BigInt: Scalars['BigInt'];
  Boolean: Scalars['Boolean'];
  CreateInputTemplateInput: CreateInputTemplateInput;
  CreateOutputTemplateInput: CreateOutputTemplateInput;
  CreateReportingPeriodInput: CreateReportingPeriodInput;
  Date: Scalars['Date'];
  DateTime: Scalars['DateTime'];
  InputTemplate: MergePrismaWithSdlTypes<PrismaInputTemplate, MakeRelationsOptional<InputTemplate, AllMappedModels>, AllMappedModels>;
  Int: Scalars['Int'];
  JSON: Scalars['JSON'];
  JSONObject: Scalars['JSONObject'];
  Mutation: {};
  OutputTemplate: MergePrismaWithSdlTypes<PrismaOutputTemplate, MakeRelationsOptional<OutputTemplate, AllMappedModels>, AllMappedModels>;
  Query: {};
  Redwood: Redwood;
  ReportingPeriod: MergePrismaWithSdlTypes<PrismaReportingPeriod, MakeRelationsOptional<ReportingPeriod, AllMappedModels>, AllMappedModels>;
  String: Scalars['String'];
  Time: Scalars['Time'];
  UpdateInputTemplateInput: UpdateInputTemplateInput;
  UpdateOutputTemplateInput: UpdateOutputTemplateInput;
  UpdateReportingPeriodInput: UpdateReportingPeriodInput;
};

export type requireAuthDirectiveArgs = {
  roles?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type requireAuthDirectiveResolver<Result, Parent, ContextType = RedwoodGraphQLContext, Args = requireAuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type skipAuthDirectiveArgs = { };

export type skipAuthDirectiveResolver<Result, Parent, ContextType = RedwoodGraphQLContext, Args = skipAuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

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
  createInputTemplate: Resolver<ResolversTypes['InputTemplate'], ParentType, ContextType, RequireFields<MutationcreateInputTemplateArgs, 'input'>>;
  createOutputTemplate: Resolver<ResolversTypes['OutputTemplate'], ParentType, ContextType, RequireFields<MutationcreateOutputTemplateArgs, 'input'>>;
  createReportingPeriod: Resolver<ResolversTypes['ReportingPeriod'], ParentType, ContextType, RequireFields<MutationcreateReportingPeriodArgs, 'input'>>;
  deleteInputTemplate: Resolver<ResolversTypes['InputTemplate'], ParentType, ContextType, RequireFields<MutationdeleteInputTemplateArgs, 'id'>>;
  deleteOutputTemplate: Resolver<ResolversTypes['OutputTemplate'], ParentType, ContextType, RequireFields<MutationdeleteOutputTemplateArgs, 'id'>>;
  deleteReportingPeriod: Resolver<ResolversTypes['ReportingPeriod'], ParentType, ContextType, RequireFields<MutationdeleteReportingPeriodArgs, 'id'>>;
  updateInputTemplate: Resolver<ResolversTypes['InputTemplate'], ParentType, ContextType, RequireFields<MutationupdateInputTemplateArgs, 'id' | 'input'>>;
  updateOutputTemplate: Resolver<ResolversTypes['OutputTemplate'], ParentType, ContextType, RequireFields<MutationupdateOutputTemplateArgs, 'id' | 'input'>>;
  updateReportingPeriod: Resolver<ResolversTypes['ReportingPeriod'], ParentType, ContextType, RequireFields<MutationupdateReportingPeriodArgs, 'id' | 'input'>>;
};

export type MutationRelationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createInputTemplate?: RequiredResolverFn<ResolversTypes['InputTemplate'], ParentType, ContextType, RequireFields<MutationcreateInputTemplateArgs, 'input'>>;
  createOutputTemplate?: RequiredResolverFn<ResolversTypes['OutputTemplate'], ParentType, ContextType, RequireFields<MutationcreateOutputTemplateArgs, 'input'>>;
  createReportingPeriod?: RequiredResolverFn<ResolversTypes['ReportingPeriod'], ParentType, ContextType, RequireFields<MutationcreateReportingPeriodArgs, 'input'>>;
  deleteInputTemplate?: RequiredResolverFn<ResolversTypes['InputTemplate'], ParentType, ContextType, RequireFields<MutationdeleteInputTemplateArgs, 'id'>>;
  deleteOutputTemplate?: RequiredResolverFn<ResolversTypes['OutputTemplate'], ParentType, ContextType, RequireFields<MutationdeleteOutputTemplateArgs, 'id'>>;
  deleteReportingPeriod?: RequiredResolverFn<ResolversTypes['ReportingPeriod'], ParentType, ContextType, RequireFields<MutationdeleteReportingPeriodArgs, 'id'>>;
  updateInputTemplate?: RequiredResolverFn<ResolversTypes['InputTemplate'], ParentType, ContextType, RequireFields<MutationupdateInputTemplateArgs, 'id' | 'input'>>;
  updateOutputTemplate?: RequiredResolverFn<ResolversTypes['OutputTemplate'], ParentType, ContextType, RequireFields<MutationupdateOutputTemplateArgs, 'id' | 'input'>>;
  updateReportingPeriod?: RequiredResolverFn<ResolversTypes['ReportingPeriod'], ParentType, ContextType, RequireFields<MutationupdateReportingPeriodArgs, 'id' | 'input'>>;
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

export type QueryResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  inputTemplate: Resolver<Maybe<ResolversTypes['InputTemplate']>, ParentType, ContextType, RequireFields<QueryinputTemplateArgs, 'id'>>;
  inputTemplates: OptArgsResolverFn<Array<ResolversTypes['InputTemplate']>, ParentType, ContextType>;
  outputTemplate: Resolver<Maybe<ResolversTypes['OutputTemplate']>, ParentType, ContextType, RequireFields<QueryoutputTemplateArgs, 'id'>>;
  outputTemplates: OptArgsResolverFn<Array<ResolversTypes['OutputTemplate']>, ParentType, ContextType>;
  redwood: OptArgsResolverFn<Maybe<ResolversTypes['Redwood']>, ParentType, ContextType>;
  reportingPeriod: Resolver<Maybe<ResolversTypes['ReportingPeriod']>, ParentType, ContextType, RequireFields<QueryreportingPeriodArgs, 'id'>>;
  reportingPeriods: OptArgsResolverFn<Array<ResolversTypes['ReportingPeriod']>, ParentType, ContextType>;
};

export type QueryRelationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  inputTemplate?: RequiredResolverFn<Maybe<ResolversTypes['InputTemplate']>, ParentType, ContextType, RequireFields<QueryinputTemplateArgs, 'id'>>;
  inputTemplates?: RequiredResolverFn<Array<ResolversTypes['InputTemplate']>, ParentType, ContextType>;
  outputTemplate?: RequiredResolverFn<Maybe<ResolversTypes['OutputTemplate']>, ParentType, ContextType, RequireFields<QueryoutputTemplateArgs, 'id'>>;
  outputTemplates?: RequiredResolverFn<Array<ResolversTypes['OutputTemplate']>, ParentType, ContextType>;
  redwood?: RequiredResolverFn<Maybe<ResolversTypes['Redwood']>, ParentType, ContextType>;
  reportingPeriod?: RequiredResolverFn<Maybe<ResolversTypes['ReportingPeriod']>, ParentType, ContextType, RequireFields<QueryreportingPeriodArgs, 'id'>>;
  reportingPeriods?: RequiredResolverFn<Array<ResolversTypes['ReportingPeriod']>, ParentType, ContextType>;
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
  certifiedBy: OptArgsResolverFn<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  certifiedBy?: RequiredResolverFn<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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

export interface TimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Time'], any> {
  name: 'Time';
}

export type Resolvers<ContextType = RedwoodGraphQLContext> = {
  BigInt: GraphQLScalarType;
  Date: GraphQLScalarType;
  DateTime: GraphQLScalarType;
  InputTemplate: InputTemplateResolvers<ContextType>;
  JSON: GraphQLScalarType;
  JSONObject: GraphQLScalarType;
  Mutation: MutationResolvers<ContextType>;
  OutputTemplate: OutputTemplateResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  Redwood: RedwoodResolvers<ContextType>;
  ReportingPeriod: ReportingPeriodResolvers<ContextType>;
  Time: GraphQLScalarType;
};

export type DirectiveResolvers<ContextType = RedwoodGraphQLContext> = {
  requireAuth: requireAuthDirectiveResolver<any, any, ContextType>;
  skipAuth: skipAuthDirectiveResolver<any, any, ContextType>;
};

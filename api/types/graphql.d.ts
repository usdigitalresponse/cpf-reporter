import { Prisma } from "@prisma/client"
import { MergePrismaWithSdlTypes, MakeRelationsOptional } from '@redwoodjs/api'
import { Agency as PrismaAgency, Organization as PrismaOrganization } from '@prisma/client'
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

export type CreateOrganizationInput = {
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAgency: Agency;
  createOrganization: Organization;
  deleteAgency: Agency;
  deleteOrganization: Organization;
  updateAgency: Agency;
  updateOrganization: Organization;
};


export type MutationcreateAgencyArgs = {
  input: CreateAgencyInput;
};


export type MutationcreateOrganizationArgs = {
  input: CreateOrganizationInput;
};


export type MutationdeleteAgencyArgs = {
  id: Scalars['Int'];
};


export type MutationdeleteOrganizationArgs = {
  id: Scalars['Int'];
};


export type MutationupdateAgencyArgs = {
  id: Scalars['Int'];
  input: UpdateAgencyInput;
};


export type MutationupdateOrganizationArgs = {
  id: Scalars['Int'];
  input: UpdateOrganizationInput;
};

export type Organization = {
  __typename?: 'Organization';
  agencies: Array<Maybe<Agency>>;
  id: Scalars['Int'];
  name: Scalars['String'];
};

/** About the Redwood queries. */
export type Query = {
  __typename?: 'Query';
  agencies: Array<Agency>;
  agenciesByOrganization: Array<Agency>;
  agency?: Maybe<Agency>;
  organization?: Maybe<Organization>;
  organizations: Array<Organization>;
  /** Fetches the Redwood root schema. */
  redwood?: Maybe<Redwood>;
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
export type QueryorganizationArgs = {
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

export type UpdateOrganizationInput = {
  name?: InputMaybe<Scalars['String']>;
};

type MaybeOrArrayOfMaybe<T> = T | Maybe<T> | Maybe<T>[];
type AllMappedModels = MaybeOrArrayOfMaybe<Agency | Organization>


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
  CreateOrganizationInput: CreateOrganizationInput;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']>;
  Mutation: ResolverTypeWrapper<{}>;
  Organization: ResolverTypeWrapper<MergePrismaWithSdlTypes<PrismaOrganization, MakeRelationsOptional<Organization, AllMappedModels>, AllMappedModels>>;
  Query: ResolverTypeWrapper<{}>;
  Redwood: ResolverTypeWrapper<Redwood>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Time: ResolverTypeWrapper<Scalars['Time']>;
  UpdateAgencyInput: UpdateAgencyInput;
  UpdateOrganizationInput: UpdateOrganizationInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Agency: MergePrismaWithSdlTypes<PrismaAgency, MakeRelationsOptional<Agency, AllMappedModels>, AllMappedModels>;
  BigInt: Scalars['BigInt'];
  Boolean: Scalars['Boolean'];
  CreateAgencyInput: CreateAgencyInput;
  CreateOrganizationInput: CreateOrganizationInput;
  Date: Scalars['Date'];
  DateTime: Scalars['DateTime'];
  Int: Scalars['Int'];
  JSON: Scalars['JSON'];
  JSONObject: Scalars['JSONObject'];
  Mutation: {};
  Organization: MergePrismaWithSdlTypes<PrismaOrganization, MakeRelationsOptional<Organization, AllMappedModels>, AllMappedModels>;
  Query: {};
  Redwood: Redwood;
  String: Scalars['String'];
  Time: Scalars['Time'];
  UpdateAgencyInput: UpdateAgencyInput;
  UpdateOrganizationInput: UpdateOrganizationInput;
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

export interface JSONScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export interface JSONObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject';
}

export type MutationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createAgency: Resolver<ResolversTypes['Agency'], ParentType, ContextType, RequireFields<MutationcreateAgencyArgs, 'input'>>;
  createOrganization: Resolver<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationcreateOrganizationArgs, 'input'>>;
  deleteAgency: Resolver<ResolversTypes['Agency'], ParentType, ContextType, RequireFields<MutationdeleteAgencyArgs, 'id'>>;
  deleteOrganization: Resolver<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationdeleteOrganizationArgs, 'id'>>;
  updateAgency: Resolver<ResolversTypes['Agency'], ParentType, ContextType, RequireFields<MutationupdateAgencyArgs, 'id' | 'input'>>;
  updateOrganization: Resolver<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationupdateOrganizationArgs, 'id' | 'input'>>;
};

export type MutationRelationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createAgency?: RequiredResolverFn<ResolversTypes['Agency'], ParentType, ContextType, RequireFields<MutationcreateAgencyArgs, 'input'>>;
  createOrganization?: RequiredResolverFn<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationcreateOrganizationArgs, 'input'>>;
  deleteAgency?: RequiredResolverFn<ResolversTypes['Agency'], ParentType, ContextType, RequireFields<MutationdeleteAgencyArgs, 'id'>>;
  deleteOrganization?: RequiredResolverFn<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationdeleteOrganizationArgs, 'id'>>;
  updateAgency?: RequiredResolverFn<ResolversTypes['Agency'], ParentType, ContextType, RequireFields<MutationupdateAgencyArgs, 'id' | 'input'>>;
  updateOrganization?: RequiredResolverFn<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationupdateOrganizationArgs, 'id' | 'input'>>;
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

export type QueryResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  agencies: OptArgsResolverFn<Array<ResolversTypes['Agency']>, ParentType, ContextType>;
  agenciesByOrganization: Resolver<Array<ResolversTypes['Agency']>, ParentType, ContextType, RequireFields<QueryagenciesByOrganizationArgs, 'organizationId'>>;
  agency: Resolver<Maybe<ResolversTypes['Agency']>, ParentType, ContextType, RequireFields<QueryagencyArgs, 'id'>>;
  organization: Resolver<Maybe<ResolversTypes['Organization']>, ParentType, ContextType, RequireFields<QueryorganizationArgs, 'id'>>;
  organizations: OptArgsResolverFn<Array<ResolversTypes['Organization']>, ParentType, ContextType>;
  redwood: OptArgsResolverFn<Maybe<ResolversTypes['Redwood']>, ParentType, ContextType>;
};

export type QueryRelationResolvers<ContextType = RedwoodGraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  agencies?: RequiredResolverFn<Array<ResolversTypes['Agency']>, ParentType, ContextType>;
  agenciesByOrganization?: RequiredResolverFn<Array<ResolversTypes['Agency']>, ParentType, ContextType, RequireFields<QueryagenciesByOrganizationArgs, 'organizationId'>>;
  agency?: RequiredResolverFn<Maybe<ResolversTypes['Agency']>, ParentType, ContextType, RequireFields<QueryagencyArgs, 'id'>>;
  organization?: RequiredResolverFn<Maybe<ResolversTypes['Organization']>, ParentType, ContextType, RequireFields<QueryorganizationArgs, 'id'>>;
  organizations?: RequiredResolverFn<Array<ResolversTypes['Organization']>, ParentType, ContextType>;
  redwood?: RequiredResolverFn<Maybe<ResolversTypes['Redwood']>, ParentType, ContextType>;
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

export interface TimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Time'], any> {
  name: 'Time';
}

export type Resolvers<ContextType = RedwoodGraphQLContext> = {
  Agency: AgencyResolvers<ContextType>;
  BigInt: GraphQLScalarType;
  Date: GraphQLScalarType;
  DateTime: GraphQLScalarType;
  JSON: GraphQLScalarType;
  JSONObject: GraphQLScalarType;
  Mutation: MutationResolvers<ContextType>;
  Organization: OrganizationResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  Redwood: RedwoodResolvers<ContextType>;
  Time: GraphQLScalarType;
};

export type DirectiveResolvers<ContextType = RedwoodGraphQLContext> = {
  requireAuth: requireAuthDirectiveResolver<any, any, ContextType>;
  skipAuth: skipAuthDirectiveResolver<any, any, ContextType>;
};

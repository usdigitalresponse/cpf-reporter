import gql from "graphql-tag";
export const schema = gql`
  type Agency {
    id: Int!
    name: String!
    abbreviation: String
    code: String!
    tenantId: Int!
  }

  type Query {
    agencies: [Agency!]! @requireAuth
    agency(id: Int!): Agency @requireAuth
    agenciesByTenant(tenantId: Int!): [Agency!]! @requireAuth
  }

  input CreateAgencyInput {
    name: String!
    abbreviation: String
    code: String!
  }

  input UpdateAgencyInput {
    name: String
    abbreviation: String
    code: String
  }

  type Mutation {
    createAgency(input: CreateAgencyInput!): Agency! @requireAuth
    updateAgency(id: Int!, input: UpdateAgencyInput!): Agency! @requireAuth
    deleteAgency(id: Int!): Agency! @requireAuth
  }
`;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJncWwiLCJzY2hlbWEiXSwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9hcGkvc3JjL2dyYXBocWwvYWdlbmNpZXMuc2RsLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBzY2hlbWEgPSBncWxgXG4gIHR5cGUgQWdlbmN5IHtcbiAgICBpZDogSW50IVxuICAgIG5hbWU6IFN0cmluZyFcbiAgICBhYmJyZXZpYXRpb246IFN0cmluZ1xuICAgIGNvZGU6IFN0cmluZyFcbiAgICB0ZW5hbnRJZDogSW50IVxuICB9XG5cbiAgdHlwZSBRdWVyeSB7XG4gICAgYWdlbmNpZXM6IFtBZ2VuY3khXSEgQHJlcXVpcmVBdXRoXG4gICAgYWdlbmN5KGlkOiBJbnQhKTogQWdlbmN5IEByZXF1aXJlQXV0aFxuICAgIGFnZW5jaWVzQnlUZW5hbnQodGVuYW50SWQ6IEludCEpOiBbQWdlbmN5IV0hIEByZXF1aXJlQXV0aFxuICB9XG5cbiAgaW5wdXQgQ3JlYXRlQWdlbmN5SW5wdXQge1xuICAgIG5hbWU6IFN0cmluZyFcbiAgICBhYmJyZXZpYXRpb246IFN0cmluZ1xuICAgIGNvZGU6IFN0cmluZyFcbiAgfVxuXG4gIGlucHV0IFVwZGF0ZUFnZW5jeUlucHV0IHtcbiAgICBuYW1lOiBTdHJpbmdcbiAgICBhYmJyZXZpYXRpb246IFN0cmluZ1xuICAgIGNvZGU6IFN0cmluZ1xuICB9XG5cbiAgdHlwZSBNdXRhdGlvbiB7XG4gICAgY3JlYXRlQWdlbmN5KGlucHV0OiBDcmVhdGVBZ2VuY3lJbnB1dCEpOiBBZ2VuY3khIEByZXF1aXJlQXV0aFxuICAgIHVwZGF0ZUFnZW5jeShpZDogSW50ISwgaW5wdXQ6IFVwZGF0ZUFnZW5jeUlucHV0ISk6IEFnZW5jeSEgQHJlcXVpcmVBdXRoXG4gICAgZGVsZXRlQWdlbmN5KGlkOiBJbnQhKTogQWdlbmN5ISBAcmVxdWlyZUF1dGhcbiAgfVxuYFxuIl0sIm1hcHBpbmdzIjoiT0FBc0JBLEdBQUc7QUFBekIsT0FBTyxNQUFNQyxNQUFNLEdBQUdELEdBQUk7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIn0=
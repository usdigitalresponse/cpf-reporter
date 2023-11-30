import gql from "graphql-tag";
export const schema = gql`
  type Agency {
    id: Int!
    name: String!
    abbreviation: String
    code: String!
  }

  type Query {
    agencies: [Agency!]! @requireAuth
    agency(id: Int!): Agency @requireAuth
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJncWwiLCJzY2hlbWEiXSwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9hcGkvc3JjL2dyYXBocWwvYWdlbmNpZXMuc2RsLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBzY2hlbWEgPSBncWxgXG4gIHR5cGUgQWdlbmN5IHtcbiAgICBpZDogSW50IVxuICAgIG5hbWU6IFN0cmluZyFcbiAgICBhYmJyZXZpYXRpb246IFN0cmluZ1xuICAgIGNvZGU6IFN0cmluZyFcbiAgfVxuXG4gIHR5cGUgUXVlcnkge1xuICAgIGFnZW5jaWVzOiBbQWdlbmN5IV0hIEByZXF1aXJlQXV0aFxuICAgIGFnZW5jeShpZDogSW50ISk6IEFnZW5jeSBAcmVxdWlyZUF1dGhcbiAgfVxuXG4gIGlucHV0IENyZWF0ZUFnZW5jeUlucHV0IHtcbiAgICBuYW1lOiBTdHJpbmchXG4gICAgYWJicmV2aWF0aW9uOiBTdHJpbmdcbiAgICBjb2RlOiBTdHJpbmchXG4gIH1cblxuICBpbnB1dCBVcGRhdGVBZ2VuY3lJbnB1dCB7XG4gICAgbmFtZTogU3RyaW5nXG4gICAgYWJicmV2aWF0aW9uOiBTdHJpbmdcbiAgICBjb2RlOiBTdHJpbmdcbiAgfVxuXG4gIHR5cGUgTXV0YXRpb24ge1xuICAgIGNyZWF0ZUFnZW5jeShpbnB1dDogQ3JlYXRlQWdlbmN5SW5wdXQhKTogQWdlbmN5ISBAcmVxdWlyZUF1dGhcbiAgICB1cGRhdGVBZ2VuY3koaWQ6IEludCEsIGlucHV0OiBVcGRhdGVBZ2VuY3lJbnB1dCEpOiBBZ2VuY3khIEByZXF1aXJlQXV0aFxuICAgIGRlbGV0ZUFnZW5jeShpZDogSW50ISk6IEFnZW5jeSEgQHJlcXVpcmVBdXRoXG4gIH1cbmBcbiJdLCJtYXBwaW5ncyI6Ik9BQXNCQSxHQUFHO0FBQXpCLE9BQU8sTUFBTUMsTUFBTSxHQUFHRCxHQUFJO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIn0=
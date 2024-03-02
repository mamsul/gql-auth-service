const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    home: String
  }

  type Mutation {
    auth(email: String!, password: String!): AuthResponse
  }

  type AuthResponse {
    token: String
    email: String
    expired: Int
  }
`;

module.exports = typeDefs;

const {gql} = require('apollo-server-express');

const typeDefs = gql `
  type Post {
    title: String
    text: String
    views: Int
  }

  type User {
    email: String
    name: String
    password: String
  }

  input userInputData {
    email: String!
    name: String!
    password: String!
  }
  
  type Query {
    hello: String,
    post: Post
  }

  type Mutation {
    createUser(userInput: userInputData): User
  }
`;

module.exports = typeDefs
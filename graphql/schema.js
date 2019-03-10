const {gql} = require('apollo-server-express');

const typeDefs = gql `
  type Post {
    title: String
    text: String
    views: Int
  }

  type User {
    userId: String
    email: String
    name: String
    password: String
    token: String
  }

  input userInputData {
    email: String!
    name: String!
    password: String!
  }
  
  input loginInputData {
    email: String!
    password: String!
  }
  
  type Query {
    hello: String,
    post: Post
  }

  type Mutation {
    createUser(userInput: userInputData): User
    login(loginInput: loginInputData): User
  }
`;

module.exports = typeDefs
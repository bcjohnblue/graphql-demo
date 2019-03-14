const {gql} = require('apollo-server-express');

const typeDefs = gql `
  type Post {
    title: String
    text: String
    views: Int
  }

  type Cart {
    items: [CartItem]
  }

  type CartItem {
    productId: String
    quantity: Int
  }

  type Product {
    productId: String
    title: String
    price: String
    description: String
    imageUrl: String
  }

  type User {
    userId: String
    email: String
    name: String
    password: String
    token: String
    cart: Cart
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

  input productInputData {
    title: String
    price: String
    description: String
    imageUrl: String
  }

  type Query {
    hello: String
    post: Post
  }

  type Mutation {
    createUser(userInput: userInputData): User
    login(loginInput: loginInputData): User
    getProduct(productInput: productInputData): [Product]
    createProduct(productInput: productInputData): Product
    addToCart(userId: ID!, productId: ID): User
    getCart(userId: ID!): [Product]
  }
`;

module.exports = typeDefs;
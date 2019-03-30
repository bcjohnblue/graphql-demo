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
    product: Product
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
    name: String
    password: String
  }

  input loginInputData {
    email: String!
    password: String!
  }

  input productInputData {
    title: String
    price: Int
    description: String
    imageUrl: String
  }

  type Query {
    hello: String
    post: Post
  }

  type Mutation {
    # createUser(email: String!, name: String, password: String): User
    createUser(userInput: userInputData): User
    login(loginInput: loginInputData): User
    getProducts(productInput: productInputData): [Product]
    createProduct(productInput: productInputData): Product
    addToCart(userId: ID!, productId: ID): User
    getCart(userId: ID!): [CartItem]
  }
`;

module.exports = typeDefs;
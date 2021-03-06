const express = require('express');
const {
  ApolloServer,
  gql
} = require('apollo-server-express');

const mongoose = require('mongoose')
const MONGODB_URI = 'mongodb+srv://bcjohn:bcjohn@cluster0-kqft0.mongodb.net/test?retryWrites=true'

const typeDefs = require('./graphql/schema')
const resolvers = require('./graphql/resolvers')

const brcypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const app = express();

const bodyParser = require('body-parser')
app.use(bodyParser.json())

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const User = require('./models/user')
const Product = require('./models/product')

// app.use('/', (req, res, next) => {
//   console.log('In middleware!')
//   res.send('<div>Hello!</div>')
//   next()
// })



// const typeDefs = gql `
//   type Query {
//     "A simple query"
//     hello: String
//   }
// `;

// const resolvers = {
//   Query: {
//     hello: () => 'world'
//   }
// };

const server = new ApolloServer({
  typeDefs,
  resolvers
});
server.applyMiddleware({
  app
});

(async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    // const user = new User({
    //   email: 'bcjohnblue@gmail.com',
    //   name: 'bcjohn',
    //   password: 'bcjohn'
    // })
    // user.save()
    await app.listen({
      port: 4000
    });
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  } catch (err) {
    console.log(err)
  }
})()
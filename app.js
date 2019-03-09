const express = require('express');
const {
  ApolloServer,
  gql
} = require('apollo-server-express');

const mongoose = require('mongoose')
const MONGODB_URI = 'mongodb+srv://bcjohn:bcjohn@cluster0-kqft0.mongodb.net/test?retryWrites=true'

const typeDefs = require('./graphql/schema')
const resolvers = require('./graphql/resolvers')

const bodyParser = require('body-parser')
// app.use(bodyParser.json())

const app = express();


const User = require('./models/user')

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
    const user = new User({
      email: 'bcjohnblue@gmail.com',
      name: 'bcjohn',
      password: 'bcjohn'
    })
    user.save()
    await app.listen({
      port: 4000
    });
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  } catch (err) {
    console.log(err)
  }
})()
const {
  ApolloServer,
  gql
} = require('apollo-server');

const typeDefs = gql `
  type Query {
    "A simple query"
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'world'
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({
  url
}) => {
  console.log(`? server ready at ${url}`);
});
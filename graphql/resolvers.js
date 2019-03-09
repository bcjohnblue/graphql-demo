const resolvers = {
  Query: {
    hello() {
      return 'Hello world!'
    },
    // post() {
    //   return {
    //     text: 'text',
    //     views: 1245
    //   }
    // }
  },
  Mutation: {
    createUser: (root, args, context) => {
      console.log(args)
      const {userInput} = args
      const {
        email,
        name,
        password
      } = userInput;
      return {
        email,
        name,
        password
      }
    }
  }
};

module.exports = resolvers
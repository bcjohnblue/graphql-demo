const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

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
    async createUser(root, {userInput}, context) {
      let {
        email,
        name,
        password
      } = userInput;
      console.log(password);

      const hash = await bcrypt.hash(password, 12)
      // await bcrypt.genSalt(10, function (err, salt) {
      //   bcrypt.hash(password, salt, function (err, hash) {
      //     password = hash
      //     console.log(hash);

      //   })
      // })
      console.log(hash);

      const user = new User({
        email,
        name,
        password
      })
      const createdUser = await user.save();
      const result = {
        ...createdUser._doc,
        userId: createdUser._id.toString()
      }
      console.log(createdUser)
      console.log(result.id)
      return {
        ...createdUser._doc,
        userId: createdUser._id.toString()
      }
    },
    async login(root, {
      loginInput: {
        email,
        password
      }
    }, context) {

      const user = await User.findOne({
        email
      })

      if (!user) {
        const error = new Error('User not found!')
        error.code = 401
        throw error
      }
      console.log(user.password);

      const isEqual = await bcrypt.compare(password, user.password)
      if (!isEqual) {
        const error = new Error('Password not matched!')
        error.code = 401
        throw error
      }

      const token = jwt.sign({
        userId: user._id.toString(),
        email: user.email
      }, 'secret', {
        expiresIn: '1h'
      })
      console.log({
        ...user._doc,
        token,
        userId: user._id.toString(),
      });

      return {
        name: user.name,
        userId: user._id.toString(),
        token,
      }
    }
  }
};

module.exports = resolvers
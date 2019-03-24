const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Product = require('../models/product');

const resolvers = {
  Query: {
    hello() {
      return 'Hello world!';
    }
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
      console.log(userInput);

      const hash = await bcrypt.hash(password, 12);
      const hasUser = await User.findOne({
        email
      });

      if (hasUser) {
        const error = new Error('User has been registered!');
        error.code = 404;
        throw error;
      }

      // const user = new User({
      //   email,
      //   name,
      //   password
      // });
      // const createdUser = await user.save();
      // const result = {
      //   ...createdUser._doc,
      //   userId: createdUser._id.toString()
      // };
      // console.log(createdUser);
      // console.log(result.id);
      // return {
      //   ...createdUser._doc,
      //   userId: createdUser._id.toString()
      // };
    },
    async login(
      root, {
        loginInput: {
          email,
          password
        }
      },
      context
    ) {
      const user = await User.findOne({
        email
      });

      if (!user) {
        const error = new Error('User not found!');
        error.code = 401;
        throw error;
      }
      console.log(user.password);

      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        const error = new Error('Password not matched!');
        error.code = 401;
        throw error;
      }

      const token = jwt.sign({
          userId: user._id.toString(),
          email: user.email
        },
        'secret', {
          expiresIn: '1h'
        }
      );
      console.log({
        ...user._doc,
        token,
        userId: user._id.toString()
      });

      return {
        name: user.name,
        userId: user._id.toString(),
        token
      };
    },
    async getProduct(root, {productInput}, text) {
      let result;
      const {title} = productInput;
      if (title) {
        result = await Product.find({
          title: {
            $regex: `.*${title}.*`
          }
        });
      } else {
        result = await Product.find();
      }

      console.log(result);
      return result;
    },
    async createProduct(root, {productInput}, text) {
      const {
        title,
        price,
        description,
        imageUrl
      } = productInput;
      const product = new Product({
        title,
        price,
        description,
        imageUrl
      });
      const createdProduct = await product.save();
      return {
        ...createdProduct._doc,
        productId: createdProduct._id.toString()
      };
    },
    async addToCart(root, {
      userId,
      productId
    }, text) {
      const user = await User.findById(userId);
      console.log('user', user);

      user.cart.items.push({
        productId,
        quantity: 1
      });
      user.save();

      // const items = {
      //   productId,
      //   quantity: 1
      // }
      // const result = await user.updateOne({
      //   _id: userId
      // }, {
      //   $push: {
      //     'cart.items': {
      //       items
      //     }
      //   }
      // })

      // const inCart = user.cart.items.includes(productId);
      // console.log(result)
      return user;
    },
    async getCart(root, {userId}) {
      const user = await User.findById(userId);
      console.log(user.cart.items);
      console.log(user._doc);
      const productId = user.cart.items.map(item => item.productId);
      const product = await Product.find({
        _id: {
          $in: productId
        }
      });
      console.log(productId);

      console.log(product);

      return [...product]
    }
  }
};

module.exports = resolvers;
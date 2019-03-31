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

      const hashPassword = await bcrypt.hash(password, 12);
      const hasUser = await User.findOne({
        email
      });

      if (hasUser) {
        const error = new Error('User has been registered!');
        error.code = 404;
        throw error;
      }

      const user = new User({
        email,
        name,
        password: hashPassword
      });
      const createdUser = await user.save();
      const result = {
        ...createdUser._doc,
        userId: createdUser._id.toString()
      };
      console.log(createdUser);
      console.log(result.id);
      return {
        ...createdUser._doc,
        userId: createdUser._id.toString()
      };
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
    async getProducts(root, {productInput}, text) {
      let result;
      const {
        title,
        price
      } = productInput;
      const sortOptions = price ? {
        price
      } : {};

      if (title) {
        result = await Product.find({
          title: {
            $regex: `.*${title}.*`
          }
        }).sort(sortOptions).exec();
      } else {
        result = await Product.find().sort(sortOptions).exec();
      }

      // console.log(result);
      result.map(item => item.productId = item._id)
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

      let product = await Product.find({
        _id: {
          $in: productId
        }
      });
      product = {
        productId: product[0]._doc._id,
        ...product[0]._doc
      }

      const target = user.cart.items.find(item => item.product.productId === productId)
      console.log(target);

      if (target) {
        target.quantity += 1
      } else {
        user.cart.items.push({
          product,
          quantity: 1
        });
      }

      console.log(user.cart.items);

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
      // console.log(user._doc);
      // const productId = user.cart.items.map(item => item.productId);
      // const product = await Product.find({
      //   _id: {
      //     $in: productId
      //   }
      // });
      // console.log(productId);

      // console.log(product);

      return user.cart.items
    },
    async deleteCart(root, {
      userId,
      productId
    }) {
      let user = await User.findById(userId);
      console.log(user);

      const targetIndex = user.cart.items.findIndex(item => item.product.productId === productId)
      if (targetIndex !== -1) user.cart.items.splice(targetIndex, 1)

      console.log(targetIndex);
      user.save();
      console.log(user);
      user = {
        userId: user._id,
        ...user
      }

      return user
    }
  }
};

module.exports = resolvers;
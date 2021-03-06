const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: {
    type: Number,
  },
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  cart: {
    items: [{
      product: {
        productId: String,
        title: String,
        price: Number,
        description: String,
        imageUrl: String,
      },
      quantity: {
        type: Number,
      }
    }]
  }
  // cart: {
  //   items: [{
  //     productId: {
  //       type: Schema.Types.ObjectId,
  //       ref: 'Product',
  //     },
  //     quantity: {
  //       type: Number,
  //     }
  //   }]
  // }
})

module.exports = mongoose.model('User', userSchema)
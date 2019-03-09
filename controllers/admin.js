const Product = require('../models/product')

exports.postAddProduct = async (req, res, next) => {
  const {
    title,
    price,
    description,
    imageUrl
  } = req.body
  const product = new Product({
    title,
    price,
    description,
    imageUrl
  })
  try {
    const result = await product.save();
    console.log(result)
    console.log('Created product!')
  } catch (err) {
    console.log(err)
  }
}
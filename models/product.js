const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  threshold: Number
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

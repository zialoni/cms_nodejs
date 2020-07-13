var mongoose = require("mongoose");

//Page Schema

var ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
  },
  desc: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },

  image: {
    type: String,
  },
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;

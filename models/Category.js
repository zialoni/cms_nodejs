var mongoose = require("mongoose");

//Page Schema

var CategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;

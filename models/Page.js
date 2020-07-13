var mongoose = require("mongoose");

//Page Schema

var PageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },

  sorting: {
    type: Number,
  },
});

const Page = mongoose.model("Page", PageSchema);

module.exports = Page;

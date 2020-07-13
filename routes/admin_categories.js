var express = require("express");
var router = express.Router();

//Get category model

var Category = require("../models/Category");

router.get("/", (req, res) => {
  Category.find(function (err, categories) {
    if (err) return console.log(err);
    res.render("admin/categories", {
      categories: categories,
    });
  });
});

//Get add category

router.get("/add-category", (req, res) => {
  var title = " ";

  res.render("admin/add_category", {
    title: title,
  });
});

//Get Edit category

router.get("/edit-category/:id", (req, res) => {
  Category.findById(req.params.id, function (err, category) {
    if (err) return console.log(err);
    res.render("admin/edit_category", {
      title: category.title,
      id: category._id,
    });
  });
});

//POST add category

router.post("/add-category", (req, res) => {
  console.log(req.body);
  const title = req.body.title;
  const slug = req.body.title;
  let errors = [];

  if (!title) {
    console.log("please fill in all fields");
  } else {
    Category.findOne({ slug: slug }).then((cat) => {
      if (cat) {
        console.log("you have an error");
        res.render("admin/add_category", {
          title: title,
        });
      } else {
        const newCategory = new Category({
          title,
          slug,
        });
        newCategory.save().then((cat) => {
          console.log("you have successfully registered");
          res.redirect("/admin/pages");
        });
      }
    });
  }
});

//Post Edit Page

router.post("/edit-category/:id", (req, res) => {
  console.log(req.body);
  const title = req.body.title;
  const slug = req.body.title;
  const id = req.params.id;
  let errors = [];

  if (!title) {
    console.log("please fill in all fields");
  } else {
    Category.findOne({ slug: slug, _id: { $ne: id } }).then((category) => {
      if (category) {
        console.log("you have an error");
        res.render("admin/edit_category", {
          title,
          id,
        });
      } else {
        Category.findById(id, function (err, category) {
          if (err) return console.log(err);
          category.title = title;
          category.slug = slug;

          category.save().then((page) => {
            console.log("you have successfully registered");
            res.redirect("/admin/categories/edit-category/" + id);
          });
        });
      }
    });
  }
});

//DELETE categories

router.get("/delete-category/:id", (req, res) => {
  Category.findByIdAndRemove(req.params.id, function (err) {
    if (err) return console.log(err);
    res.redirect("/admin/categories");
  });
});

//Exports

module.exports = router;

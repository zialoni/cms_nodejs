var express = require("express");
var router = express.Router();

//Get Page model

var Page = require("../models/Page");

router.get("/", (req, res) => {
  Page.find({})
    .sort({ sorting: 1 })
    .exec(function (err, pages) {
      res.render("admin/pages", {
        pages: pages,
      });
    });
});

//Post reorder pages

router.post("/reorder-pages", (req, res) => {
  console.log(req.body);
});

//Get add page

router.get("/add-page", (req, res) => {
  var title = " ";
  var slug = "";
  var content = "";
  res.render("admin/add_page", {
    title: title,
    slug: slug,
    content: content,
  });
});

//Get Edit page

router.get("/edit-page/:id", (req, res) => {
  Page.findById(req.params.id, function (err, page) {
    if (err) return console.log(err);
    res.render("admin/edit_page", {
      title: page.title,
      slug: page.slug,
      content: page.content,
      id: page._id,
    });
  });
});

//POST add page

router.post("/add-page", (req, res) => {
  console.log(req.body);
  const { title, slug, content } = req.body;
  let errors = [];

  if (!title || !slug || !content) {
    console.log("please fill in all fields");
  } else {
    Page.findOne({ slug: slug }).then((page) => {
      if (page) {
        console.log("you have an error");
      } else {
        const newPage = new Page({
          title,
          slug,
          content,
          sorting: 100,
        });
        newPage.save().then((page) => {
          console.log("you have successfully registered");
          res.redirect("/admin/pages");
        });
      }
    });
  }
});

//Post Edit Page

router.post("/edit-page/:id", (req, res) => {
  console.log(req.body);
  const title = req.body.title;
  const slug = req.body.title;
  const content = req.body.content;
  const id = req.params.id;
  let errors = [];

  if (!title || !slug || !content) {
    console.log("please fill in all fields");
  } else {
    Page.findOne({ slug: slug, _id: { $ne: id } }).then((page) => {
      if (page) {
        console.log("you have an error");
        res.render("admin/edit_page", {
          title,
          slug,
          content,
          id,
        });
      } else {
        Page.findById(id, function (err, page) {
          if (err) return console.log(err);
          page.title = title;
          page.slug = slug;
          page.content = content;

          page.save().then((page) => {
            console.log("you have successfully registered");
            res.redirect("/admin/pages/edit-page/" + id);
          });
        });
      }
    });
  }
});

//DELETE Page

router.get("/delete-page/:id", (req, res) => {
  Page.findByIdAndRemove(req.params.id, function (err) {
    if (err) return console.log(err);
    res.redirect("/admin/pages");
  });
});

//Exports

module.exports = router;

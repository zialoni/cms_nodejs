var express = require("express");
var router = express.Router();
let mkdirp = require("mkdirp");
let fs = require("fs-extra");
let resizeImg = require("resize-img");

//Get Product model

var Product = require("../models/Product");

//Get Product model

var Category = require("../models/Category");

//get product

router.get("/", (req, res) => {
  var count;

  Product.count(function (err, c) {
    count = c;
  });
  Product.find(function (err, products) {
    res.render("admin/products", {
      products: products,
      count: count,
    });
  });
});

//Get category modal
//var Category = require("../models/category");
//Get add product

router.get("/add-product", (req, res) => {
  var title = " ";
  var desc = "";
  var price = "";
  Category.find(function (err, categories) {
    res.render("admin/add_product", {
      title: title,
      desc: desc,
      categories: categories,
      price: price,
    });
  });
});

//Get Edit Product

router.get("/edit-product/:id", (req, res) => {
  Category.find(function (err, categories) {
    Product.findById(req.params.id, function (err, p) {
      if (err) {
        console.log(err);
        res.redirect("/admin/products");
      } else {
        var gallaryDir = "public/product_images/" + p._id + "/gallery";
        var galleryImages = null;

        fs.readdir(gallaryDir, function (err, files) {
          if (err) {
            console.log(err);
          } else {
            galleryImages = files;
            res.render("admin/edit_product", {
              title: p.title,
              desc: p.desc,
              categories: categories,
              category: p.category.replace(/\s+/g, "-").toLowerCase(),
              price: p.price,
              image: p.image,
              gallaryImages: galleryImages,
              id: p._id,
            });
          }
        });
      }
    });
  });
});

//POST add product

router.post("/add-product", (req, res) => {
  var imageFile =
    typeof req.files.image !== "undefined" ? req.files.image.name : "";

  //req.checkBody("image", "You must upload an image").isImage(imageFile);

  req.checkBody("title", "Title must have a value").notEmpty();
  req.checkBody("desc", "desc must have a value").notEmpty();
  req.checkBody("price", "Price must have a value").isDecimal();
  req.checkBody("image", "Price must have a value").isImage(imageFile);

  const title = req.body.title;
  const slug = req.body.title;
  const desc = req.body.desc;
  const price = req.body.price;
  const category = req.body.category;

  let errors = req.validationErrors();

  if (errors) {
    console.log("please fill in all fields");
    Category.find(function (err, categories) {
      res.render("admin/add_product", {
        title: title,
        desc: desc,
        categories: categories,
        price: price,
      });
    });
  } else {
    Product.findOne({ slug: slug }, function (err, product) {
      if (product) {
        Category.find(function (err, categories) {
          res.render("admin/add_product", {
            title,
            desc,
            categories,
            price,
          });
        });
      } else {
        let price2 = parseFloat(price).toFixed(2);
        const product = new Product({
          title,
          slug,
          desc,
          price: price2,
          category,
          image: imageFile,
        });
        product.save(function (err) {
          if (err) return console.log(err);
          console.log(product);

          fs.ensureDir(`public/product_images/${product._id}`, function (err) {
            return console.log(err);
          });

          fs.ensureDir(
            "public/product_images/" + product._id + "/gallery",
            function (err) {
              return console.log(err);
            }
          );
          fs.ensureDir(
            "public/product_images/" + product._id + "/gallery/thumbs",
            function (err) {
              return console.log(err);
            }
          );
          if (imageFile != "") {
            let productImage = req.files.image;
            let path = "public/product_images/" + product._id + "/" + imageFile;

            productImage.mv(path, function (err) {
              return console.log(err);
            });
          }
          console.log("you have successfully registered");
          res.redirect("/admin/products");
        });
      }
    });
  }
});

//Post Edit Product

router.post("/edit-product/:id", (req, res) => {
  var imageFile =
    typeof req.files.image !== "undefined" ? req.files.image.name : "";

  //req.checkBody("image", "You must upload an image").isImage(imageFile);

  req.checkBody("title", "Title must have a value").notEmpty();
  req.checkBody("desc", "desc must have a value").notEmpty();
  req.checkBody("price", "Price must have a value").isDecimal();
  req.checkBody("image", "Price must have a value").isImage(imageFile);

  const title = req.body.title;
  const slug = req.body.title;
  const desc = req.body.desc;
  const price = req.body.price;
  const category = req.body.category;
  const pimage = req.body.pimage;
  const id = req.params.id;
  let errors = req.validationErrors();
  if (errors) {
    res.redirect("/admin/products/edit-product/" + id);
  } else {
    Product.findOne({ slug: slug, _id: { $ne: id } }, function (err, p) {
      if (err) console.log(err);

      if (p) {
        console.log("product title exists");
        res.redirect("/admin/products/edit-product/" + id);
      } else {
        Product.findById(id, function (err, p) {
          if (err) console.log(err);
          p.title = title;
          p.slug = slug;
          p.desc = desc;
          p.price = parseFloat(price).toFixed(2);
          p.category = category;
          if (imageFile != "") {
            p.image = imageFile;
          }
          p.save(function (err) {
            if (err) console.log(err);

            if (imageFile != "") {
              if (pimage != "") {
                fs.remove(
                  "public/product_images/" + id + "/" + pimage,
                  function (err) {
                    if (err) console.log(err);
                  }
                );
              }
              var productImage = req.files.image;
              var path = "public/product_images/" + id + "/" + imageFile;
              productImage.mv(path, function (err) {
                return console.log(err);
              });
            }
            console.log("Product edited");
            res.redirect("/admin/products/edit-product/" + id);
          });
        });
      }
    });
  }
});

// Post product gallery

router.post("/product-gallery/:id", (req, res) => {
  var productImage = req.files.file;
  var id = req.params.id;
  var path = "public/product_images/" + id + "/gallery/" + req.files.file.name;
  var thumbsPath =
    "public/product_images/" + id + "/gallery/thumbs/" + req.files.file.name;

  productImage.mv(path, function (err) {
    if (err) console.log(err);
    resizeImg(fs.readFileSync(path), { width: 100, height: 100 }).then(
      function (buf) {
        fs.writeFileSync(thumbsPath, buf);
      }
    );
  });
  res.sendStatus(200);
});

//Get DELETE Image

router.get("/delete-image/:image", (req, res) => {
  var origionalImage =
    "public/product_images/" + req.query.id + "/gallery/" + req.params.image;
  var thumbImage =
    "public/product_images/" +
    req.query.id +
    "/gallery/thumbs/" +
    req.params.image;

  fs.remove(origionalImage, function (err) {
    if (err) {
      console.log(err);
    } else {
      fs.remove(thumbImage, function (err) {
        if (err) {
          console.log(err);
        } else {
          //req.flash("success", "Image edited");
          res.redirect("/admin/products/edit-product/" + req.query.id);
        }
      });
    }
  });
});

//DELETE Page

router.get("/delete-product/:id", (req, res) => {
  var id = req.params.id;
  var path = "public/product_images/" + id;

  fs.remove(path, function (err) {
    if (err) {
      console.log(err);
    } else {
      Product.findByIdAndRemove(id, function (err) {
        console.log(err);
      });
      res.redirect("/admin/products");
    }
  });
});

//Exports

module.exports = router;

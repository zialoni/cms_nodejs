var express = require("express");

var path = require("path");
const passport = require("passport");

const flash = require("connect-flash");

var mongoose = require("mongoose");

var bodyparser = require("body-parser");

var config = require("./config/db");

var session = require("express-session");

var fileUpload = require("express-fileupload");

var expressValidator = require("express-validator");

// URI = process.env.MONGODB_URI;

mongoose.connect(
  config.db,
  { useNewUrlParser: true, useCreateIndex: true },
  (req, res) => {
    console.log("db is connected");
  }
);

//Init app

var app = express();

//view engine setup

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Set global errors variables
app.locals.errors = null;

//Get Page Model

//Get all pages to pass to header.ejs

//set public folder

app.use(express.static(path.join(__dirname, "public")));

//express-session middleware

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

//Express fileUpload middleware

app.use(fileUpload());

//body-parser

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//express-validator
app.use(
  expressValidator({
    errorFormatter: function (param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value,
      };
    },
    customValidators: {
      isImage: function (value, filename) {
        var extension = path.extname(filename).toLowerCase();
        switch (extension) {
          case ".jpg":
            return ".jpg";
          case ".jpeg":
            return ".jpg";
          case ".png":
            return ".png";
          case "":
            return ".jpg";
          default:
            return false;
        }
      },
    },
  })
);

//routes

var pages = require("./routes/pages");
var admnpages = require("./routes/admn_pages");
var admincategories = require("./routes/admin_categories");
var adminproducts = require("./routes/admin_products");

app.use("/", pages);

app.use("/admin/pages", admnpages);
app.use("/admin/categories", admincategories);
app.use("/admin/products", adminproducts);

//Passport middleware

app.use(passport.initialize());
app.use(passport.session());

//express-messages middleware
/*
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error_msg = req.flash("error");
  next();
});
*/
//start the server

var port = 3000;
app.listen(port, function () {
  console.log("Server started on port " + port);
});

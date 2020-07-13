var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  res.render("index", {
    title: "Home",
  });
});

//Get apage

router.get("/test", (req, res) => {
  res.json("pages test");
});
//Exports

module.exports = router;

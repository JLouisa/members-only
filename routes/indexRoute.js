const express = require("express");
const router = express.Router();
const userController = require("../controller/loginController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.redirect("/login");
});

/* GET login */
router.get("/login", userController.loginGet);

/* GET login */
router.post("/login", function (req, res, next) {
  res.render("login", {
    title: "Log in",
  });
});

module.exports = router;

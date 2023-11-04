const express = require("express");
const router = express.Router();
const loginController = require("../controller/loginController");
const passport = require("passport");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

/* GET login */
router.get("/login", loginController.loginGet);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;

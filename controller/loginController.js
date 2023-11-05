const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

exports.loginGet = asyncHandler(async function (req, res, next) {
  res.render("login", {
    title: "Log in",
  });
});

exports.loginPost = asyncHandler(async function (req, res, next) {
  body("userName")
    .notEmpty()
    .withMessage("Username must not be empty")
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage("Username must be between 5 and 50 characters")
    .matches(/^[a-zA-Z0-9_]*$/)
    .withMessage("Username can only contain letters, numbers, and underscores")
    .escape();
  body("password").notEmpty().withMessage("Password must not be empty").trim().escape();

  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  });
});

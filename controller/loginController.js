const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const UserCollection = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.loginGet = asyncHandler(async function (req, res, next) {
  res.render("login", {
    title: "Log in",
  });
});

exports.loginPost = asyncHandler(async function (req, res, next) {
  console.log("Print body");
  console.log(req.body);
  body("userName")
    .notEmpty()
    .withMessage("Username must not be empty")
    .trim()
    // .isLength({ min: 5, max: 50 })
    // .withMessage("Username must be between 5 and 50 characters")
    .matches(/^[a-zA-Z0-9_]*$/)
    .withMessage("Username can only contain letters, numbers, and underscores")
    .escape();
  body("password")
    .notEmpty()
    .withMessage("Password must not be empty")
    .trim()
    // .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/)
    // .withMessage(
    //   "Password must include at least one letter, one digit, one special character, and be between 8 and 20 characters"
    // )
    .escape();

  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  });

  // // Extract the validation errors from a request.
  // const errors = validationResult(req);

  // const user = {
  //   username: req.body.username,
  //   password: req.body.username,
  // };

  // passport.authenticate("local", {
  //   successRedirect: "/login",
  //   failureRedirect: "/",
  // });

  // if (!errors.isEmpty()) {
  //   // There are errors. Render the form again with sanitized values/error messages.
  //   res.render("login", {
  //     title: "Log in Failed",
  //     text: "Log in Failed",
  //     oldUser: newUser,
  //     errors: errors.array(),
  //   });
  //   return;
  // }
});

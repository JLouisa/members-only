const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const UserCollection = require("../models/userModel");
const fs = require("fs");
const reservedUsernames = JSON.parse(fs.readFileSync(__dirname + "/reservedUsernames.json", "utf8")).reservedUsernames;

exports.userCreateGet = asyncHandler(async function (req, res, next) {
  res.render("form/user-form", { title: "Create User GET" });
});

exports.userCreatePOST = [
  // Validate and sanitize the name field.
  body("firstName")
    .notEmpty()
    .withMessage("First name must not be empty")
    .matches(/^[A-Za-z]+$/)
    .withMessage("First name can only contain letters")
    .trim()
    .isLength({ min: 2, max: 25 })
    .withMessage("First name must be between 3 and 20 characters")
    // .custom((value) => {
    //   if (/\s{2,}/.test(value)) {
    //     throw new Error();
    //   }
    // })
    // .withMessage("First name contains excessive spaces")
    .escape(),
  body("lastName")
    .notEmpty()
    .withMessage("Last name must not be empty")
    .matches(/^[A-Za-z]+$/)
    .withMessage("Last name can only contain letters")
    .trim()
    .isLength({ min: 2, max: 25 })
    .withMessage("Last name must be between 3 and 20 characters")
    // .custom((value) => {
    //   if (/\s{2,}/.test(value)) {
    //     throw new Error();
    //   }
    // })
    // .withMessage("Last name contains excessive spaces")
    .escape(),
  body("userName")
    .notEmpty()
    .withMessage("Username must not be empty")
    .trim()
    .isLength({ min: 5, max: 16 })
    .withMessage("Username must be between 1 and 16 characters")
    .matches(/^[a-zA-Z0-9_]*$/)
    .withMessage("Username can only contain letters, numbers, and underscores")
    .custom(async (value) => {
      // Check if the username is in database
      const user = await UserCollection.findOne({ userName: { $regex: new RegExp(`^${value}$`, "i") } });
      if (user || reservedUsernames.includes(value.toLowerCase())) {
        throw new Error();
      }
    })
    .withMessage("Username is unavailable")
    .escape(),
  body("email")
    .notEmpty()
    .withMessage("E-mail must not be empty")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("E-mail must be between 3 and 50 characters")
    .isEmail()
    .withMessage("E-mail adress is incorrect")
    .custom(async (value) => {
      const user = await UserCollection.findOne({ email: value });
      if (user) {
        throw new Error();
      }
    })
    .withMessage("E-mail already in use")
    .escape(),
  body("passwordConfirm").custom((value, { req }) => {
    return value === req.body.password;
  }),
  body("password")
    .notEmpty()
    .withMessage("Password must not be empty")
    .trim()
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/)
    .withMessage(
      "Password must include at least one letter, one digit, one special character, and be between 8 and 20 characters"
    )
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 and 20 characters")
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async function (req, res, next) {
    console.log(req.body);
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const newUser = new UserCollection({
      firstName: req.body.firstName.toLowerCase() || "",
      lastName: req.body.lastName.toLowerCase() || "",
      userName: req.body.userName.toLowerCase() || "",
      email: req.body.email.toLowerCase() || "",
      password: req.body.password || "",
      joinDate: new Date(),
      isAdmin: false,
      isSuspended: false,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("form/user-form", {
        title: "Form Submission Failed",
        text: "Please review and correct the following issues before re-submitting the form:",
        oldUser: newUser,
        errors: errors.array(),
      });
      return;
    } else {
      // Create a genre object with escaped and trimmed data.
      await newUser.save();

      return res.render("dashboard", {
        user: newUser,
      });
    }
  }),
];

exports.userUpdateGet = asyncHandler(async function (req, res, next) {
  res.render("index", { title: "Create User Update GET" });
});

exports.userUpdatePost = asyncHandler(async function (req, res, next) {
  res.render("index", { title: "Create User Update POST" });
});

exports.userDeleteGet = asyncHandler(async function (req, res, next) {
  res.render("index", { title: "Create User Delete GET" });
});

exports.userDeletePost = asyncHandler(async function (req, res, next) {
  res.render("index", { title: "Create User Delete GET" });
});

exports.userDetailGet = asyncHandler(async function (req, res, next) {
  res.render("index", { title: "Create User Detail GET" });
});

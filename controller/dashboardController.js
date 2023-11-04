const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const UserCollection = require("../models/userModel");
const PostCollection = require("../models/postModel");
const CommentCollection = require("../models/commentModel");

exports.dashboardGet = asyncHandler(async function (req, res, next) {
  const user = req.user;
  const posts = await PostCollection.find().populate("createdByUser").sort({ createdOnDate: 1 });
  // Render the dashboard template and pass the user information
  res.render("dashboard/dashboard", { title: "Dashboard", user: user, posts: posts });
});

exports.postIDGet = asyncHandler(async function (req, res, next) {
  const user = req.user;
  const [post, comments] = await Promise.all([
    PostCollection.findOne({ _id: req.params.id }).populate("createdByUser").exec(),
    CommentCollection.find({ createdOnPost: req.params.id }).populate("createdByUser").exec(),
  ]);
  // Render the dashboard template and pass the user information
  res.render("dashboard/post", { title: post.title, user: user, post: post, comments: comments });
});

exports.postIDPost = [
  // Validate and sanitize the comment field.
  body("addComments")
    .notEmpty()
    .withMessage("Comments must not be empty")
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Comments must be between 2 and 200 characters")
    .escape(),

  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);

    const newComment = new CommentCollection({
      text: req.body.addComments || "",
      createdByUser: req.user._id || "",
      createdOnPost: req.params.id || "",
    });

    const [post, comments] = await Promise.all([
      PostCollection.findOne({ _id: req.params.id }).populate("createdByUser").exec(),
      CommentCollection.find({ createdOnPost: req.params.id }).populate("createdByUser").exec(),
    ]);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("dashboard/post", {
        title: "Form Submission Failed",
        text: "Please review and correct the following issues before placing your comment:",
        user: req.user,
        oldComment: newComment,
        errors: errors.array(),
      });
      return;
    } else {
      // No errors, save the comment
      await newComment.save();
      // Render the dashboard template and pass the user information
      res.render("dashboard/post", {
        title: post.title,
        user: req.user,
        post: post,
        comments: comments,
        newComment: newComment,
      });
    }
  }),
];

exports.protectedAreaGet = asyncHandler(async function (req, res, next) {
  res.render("index", { title: "Create User Update GET" });
});

exports.dashboardProfileGet = asyncHandler(async function (req, res, next) {
  const user = req.user;
  // Render the profile template and pass the user information
  res.render("dashboard/profile", { title: "Profile", user: user });
});

exports.dashboardProfilePost = asyncHandler(async function (req, res, next) {
  res.render("index", { title: "Create User Delete GET" });
});

exports.userMembershipGet = asyncHandler(async function (req, res, next) {
  const user = req.user;
  // Render the profile template and pass the user information
  res.render("dashboard/membership", { title: "Membership", user: user });
});

exports.userMembershipPost = asyncHandler(async function (req, res, next) {
  const user = await UserCollection.findOne({ _id: req.user._id });
  user.isMember = true;
  await user.save();
  res.render("dashboard/membership", { title: "Membership", user: user });
});

const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const UserCollection = require("../models/userModel");
const PostCollection = require("../models/postModel");
const CommentCollection = require("../models/commentModel");

exports.dashboardGet = asyncHandler(async function (req, res, next) {
  const user = req.user;
  const posts = await PostCollection.find().populate("createdByUser").sort({ createdOnDate: -1 });
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

exports.usersGet = asyncHandler(async function (req, res, next) {
  const currentUser = req.user;
  const users = await UserCollection.find({}).exec();
  res.render("dashboard/users", { title: "Users", user: currentUser, users: users });
});

exports.userMembershipGet = asyncHandler(async function (req, res, next) {
  const user = req.user;
  // Render the profile template and pass the user information
  res.render("dashboard/membership", { user: user });
});

exports.userMembershipPost = asyncHandler(async function (req, res, next) {
  const user = await UserCollection.findOne({ _id: req.user._id });
  user.isMember = true;
  await user.save();
  res.render("dashboard/membership", { user: user });
});

exports.PostDeletePost = asyncHandler(async function (req, res, next) {
  const [updatedPost, comments] = await Promise.all([
    await PostCollection.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { isHidden: { $not: "$isHidden" } } }, // Toggle isHidden
      { new: true } // Return the updated document
    )
      .populate("createdByUser")
      .exec(),
    // PostCollection.findOne({ _id: req.params.id }).populate("createdByUser").exec(),
    CommentCollection.find({ createdOnPost: req.params.id }).populate("createdByUser").exec(),
  ]);
  res.render("dashboard/post", { title: updatedPost.title, user: req.user, post: updatedPost, comments: comments });
});

exports.postToggleHidden = asyncHandler(async function (req, res, next) {
  const postId = req.params.id;

  // Find the post by ID
  const [post, comments] = await Promise.all([
    PostCollection.findOne({ _id: postId }).populate("createdByUser").exec(),
    CommentCollection.find({ createdOnPost: req.params.id }).populate("createdByUser").exec(),
  ]);

  if (!post) {
    // Handle the case where the post is not found
    return res.status(404).json({ message: "Post not found" });
  }

  // Toggle the isHidden field
  post.isHidden = !post.isHidden;

  // Save the updated post
  await post.save();

  // Render the response as needed.
  res.render("dashboard/post", { title: post.title, user: req.user, post: post, comments: comments });
});

exports.postCreateGet = asyncHandler(async function (req, res, next) {
  const user = req.user;
  res.render("dashboard/postCreate", { title: "Create Post", user: user });
});

exports.postCreatePost = [
  // Validate and sanitize the post fields.
  body("postTitle")
    .notEmpty()
    .withMessage("Title must not be empty")
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("Title must be between 2 and 30 characters")
    .escape(),
  body("postText")
    .notEmpty()
    .withMessage("Text must not be empty")
    .trim()
    .isLength({ min: 2, max: 500 })
    .withMessage("Text must be between 2 and 500 characters")
    .escape(),

  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);

    const newPost = new PostCollection({
      title: req.body.postTitle || "",
      text: req.body.postText || "",
      createdByUser: req.user._id || "",
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("dashboard/postCreate", {
        title: "Post Creation Failed",
        text: "Please review and correct the following issues before placing your post:",
        user: req.user,
        oldPost: newPost,
        errors: errors.array(),
      });
      return;
    } else {
      // No errors, save the comment
      await newPost.save();
      // Render the dashboard template and pass the user information
      res.render("dashboard/post/", {
        title: newPost.title,
        user: req.user,
        post: newPost,
        comments: [],
        newPost: newPost,
      });
    }
  }),
];

exports.commentToggleHidden = asyncHandler(async function (req, res, next) {
  const commentId = req.params.id;
  // Find the comment by ID
  const comment = await CommentCollection.findOne({ _id: commentId })
    .populate("createdByUser")
    .populate("createdOnPost")
    .exec();
  const comments = await CommentCollection.find({ createdOnPost: comment.createdOnPost })
    .populate("createdByUser")
    .exec();

  if (!comment) {
    // Handle the case where the comment is not found
    return res.status(404).json({ message: "Comment not found" });
  }

  // Toggle the isHidden field
  comment.isHidden = !comment.isHidden;

  // Save the updated post
  await comment.save();

  const post = comment.createdOnPost;
  // Render the response as needed.
  res.redirect("/dashboard/post/" + post._id);
});

exports.adminshipPostToggle = asyncHandler(async function (req, res, next) {
  const user = await UserCollection.findOne({ _id: req.user._id });
  user.isAdmin = !user.isAdmin;
  await user.save();
  res.render("dashboard/membership", { user: user });
});

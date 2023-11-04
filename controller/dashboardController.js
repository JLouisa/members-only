const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const UserCollection = require("../models/userModel");
const CommentCollection = require("../models/commentModel");
const PostCollection = require("../models/postModel");

exports.dashboardGet = asyncHandler(async function (req, res, next) {
  const user = req.user;
  // Render the dashboard template and pass the user information
  res.render("dashboard/dashboard", { title: "Dashboard", user: user });
});

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

exports.userDeletePost = asyncHandler(async function (req, res, next) {
  res.render("index", { title: "Create User Delete GET" });
});

exports.userDetailGet = asyncHandler(async function (req, res, next) {
  res.render("index", { title: "Create User Detail GET" });
});

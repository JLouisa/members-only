const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const UserCollection = require("../models/userModel");
const CommentCollection = require("../models/commentModel");
const PostCollection = require("../models/postModel");

exports.dashboardGet = asyncHandler(async function (req, res, next) {
  res.render("dashboard", {
    title: "Dashboard",
  });
});

exports.protectedAreaGet = asyncHandler(async function (req, res, next) {
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

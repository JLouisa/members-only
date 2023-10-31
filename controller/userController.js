const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.userCreateGet = asyncHandler(async function (req, res, next) {
  res.render("index", { title: "Create User GET" });
});

exports.userCreatePOST = asyncHandler(async function (req, res, next) {
  res.render("index", { title: "Create User POST" });
});

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
  res.render("index", { title: "Create Delete GET" });
});

exports.userDetailGet = asyncHandler(async function (req, res, next) {
  res.render("index", { title: "Create User Detail GET" });
});

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const session = require("express-session");
const passport = require("passport");

const indexRouter = require("./routes/indexRoute");
const userRouter = require("./routes/userRoute");
const feedRouter = require("./routes/feedRoute");
const dashboardRouter = require("./routes/dashboardRoute");

//! Express init
const app = express();

//! Passport config
require("./config/passport")(passport);

//! MongoDB setup
const mongoInit = process.env.MONGODB_INIT;
const cluster = process.env.MONGODB_CLUSTER;
const clusterID = process.env.MONGODB_CLUSTERID;
const database = process.env.MONGODB_DB;
const mongoHost = process.env.MONGODB_HOST;
const mongoUser = encodeURIComponent(process.env.MONGODB_USER);
const mongoPass = encodeURIComponent(process.env.MONGODB_PASS);

const mongoDB =
  process.env.MONGODB_URI || `${mongoInit}${mongoUser}:${mongoPass}@${cluster}${clusterID}${database}${mongoHost}`;

async function main(db) {
  await mongoose.connect(db);
}
// MonogDB init connection
main(mongoDB).catch((err) => console.log(err));

//! view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//!Middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({ secret: process.env.SECRECT_KEY, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

//! Routes
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/feed", feedRouter);
app.use("/dashboard", dashboardRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

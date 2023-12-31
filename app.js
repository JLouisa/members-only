const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const compression = require("compression");
const helmet = require("helmet");

const indexRouter = require("./routes/indexRoute");
const userRouter = require("./routes/userRoute");
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

//! Compression
app.use(compression());

app.use(express.static(path.join(__dirname, "public")));

//! limit repeated requests to APIs and endpoints
//Set up rate limiter: maximum of twenty requests per minute
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50,
});
// Apply rate limiter to all requests
app.use(limiter);

//! Helmet protection
app.use(helmet());

app.use(
  session({
    secret: process.env.SECRECT_KEY || process.env.SESSION_SECRET || "catss",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//! Routes
app.use("/", indexRouter);
app.use("/user", userRouter);
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

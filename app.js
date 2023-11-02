const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const session = require("express-session");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const UserCollection = require("./models/userModel");

const indexRouter = require("./routes/indexRoute");
const userRouter = require("./routes/userRoute");
const feedRouter = require("./routes/feedRoute");

const app = express();

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

//! Passport Sessions
app.use(session({ secret: process.env.SECRECT_KEY, resave: false, saveUninitialized: true }));

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await UserCollection.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserCollection.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(passport.initialize());
app.use(passport.session());

//!Middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/feed", feedRouter);

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

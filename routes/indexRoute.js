const express = require("express");
const router = express.Router();
const loginController = require("../controller/loginController");
const passport = require("passport");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.redirect("/login");
});

/* GET login */
router.get("/login", loginController.loginGet);
// /* GET login */
// router.post("/login", loginController.loginPost);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

/* GET login */
router.get("/dashboard", (req, res) =>
  res.render("dashboard", {
    title: "Dashboard",
  })
);

module.exports = router;

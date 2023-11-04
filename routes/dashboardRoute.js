const express = require("express");
const dashboardController = require("../controller/dashboardController");
const router = express.Router();
const { isAuth } = require("../config/auth");

/* GET dashboard form. */
router.get("/", isAuth, dashboardController.dashboardGet);

/* GET users update form. */
router.get("/user/:id", isAuth, dashboardController.dashboardProfileGet);

/* GET users form. */
router.get("/membership", isAuth, dashboardController.userMembershipGet);

/* POST users form. */
router.post("/membership", isAuth, dashboardController.userMembershipPost);

/* Get post page */
router.get("/post/:id", isAuth, dashboardController.postIDGet);

/* POST post page */
router.post("/post/:id", isAuth, dashboardController.postIDPost);

module.exports = router;

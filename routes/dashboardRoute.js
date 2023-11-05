const express = require("express");
const dashboardController = require("../controller/dashboardController");
const router = express.Router();
const { isAuth } = require("../config/auth");
const { isAdmin } = require("../config/admin");

/* GET dashboard form. */
router.get("/", isAuth, dashboardController.dashboardGet);

/* GET users update form. */
router.get("/user/:id", isAuth, dashboardController.dashboardProfileGet);

/* GET users form. */
router.get("/membership", isAuth, dashboardController.userMembershipGet);

/* POST users form. */
router.post("/membership", isAuth, dashboardController.userMembershipPost);

/* Get post page */
router.get("/users", isAuth, isAdmin, dashboardController.usersGet);

/* GET post create request */
router.get("/post/create", isAuth, dashboardController.postCreateGet);

/* POST post create request */
router.post("/post/create", isAuth, dashboardController.postCreatePost);

/* POST post delete request */
router.post("/post/delete/:id", isAuth, isAdmin, dashboardController.postToggleHidden);

/* Get post page */
router.get("/post/:id", isAuth, dashboardController.postIDGet);

/* POST post page */
router.post("/post/:id", isAuth, dashboardController.postIDPost);

module.exports = router;

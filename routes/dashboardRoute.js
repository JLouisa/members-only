const express = require("express");
const dashboardController = require("../controller/dashboardController");
const router = express.Router();
const { isAuth } = require("../config/auth");

/* GET dashboard form. */
router.get("/", isAuth, dashboardController.dashboardGet);

/* GET users update form. */
router.get("/user/:id", isAuth, dashboardController.dashboardProfileGet);

/* POST users update form. */
router.post("/user/:id", isAuth, dashboardController.dashboardProfilePost);

/* POST dashboard form. */
router.get("/protected-area", isAuth, dashboardController.protectedAreaGet);

module.exports = router;

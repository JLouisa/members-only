const express = require("express");
const dashboardController = require("../controller/dashboardController");
const router = express.Router();
const { isAuth } = require("../config/auth");

/* GET dashboard form. */
router.get("/", isAuth, dashboardController.dashboardGet);

/* POST dashboard form. */
router.get("/protected-area", isAuth, dashboardController.protectedAreaGet);

module.exports = router;

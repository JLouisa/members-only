const express = require("express");
const userController = require("../controller/userController");
const router = express.Router();
const { isAuth } = require("../config/auth");

/* GET users form. */
router.get("/create", userController.userCreateGet);

/* POST users form. */
router.post("/create", userController.userCreatePOST);

/* GET users update form. */
router.get("/update/:id", userController.userUpdateGet);

/* POST users update form. */
router.post("/update/:id", userController.userUpdatePost);

/* GET users delete page. */
router.get("/delete/:id", userController.userDeleteGet);

/* POST users delete request. */
router.post("/delete/:id", userController.userDeletePost);

// /* Get users detail page. */
// router.get("/:id", userController.userDetailGet);

module.exports = router;

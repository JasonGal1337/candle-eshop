const express = require("express");
const controller = require("../controllers/userController");

const router = express.Router();

router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.post("/verify", controller.verify);

router.post("/editInfo", controller.editInfo);
router.post("/getUserInfo", controller.getUserInfo);

module.exports = router;
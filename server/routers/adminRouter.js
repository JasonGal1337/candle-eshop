const express = require("express");
const controller = require("../controllers/adminController");

const router = express.Router();

router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.post("/verify", controller.verify);

module.exports = router;
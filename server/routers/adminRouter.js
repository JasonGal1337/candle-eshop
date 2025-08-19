const express = require("express");
const controller = require("../controllers/adminController");
const { validate } = require("../validate");
const { adminSignupSchema, adminLoginSchema, adminVerifySchema } = require("../validators/adminValidator");

const router = express.Router();

router.post("/signup", validate(adminSignupSchema), controller.signup);
router.post("/login",  validate(adminLoginSchema),  controller.login);
router.post("/verify", validate(adminVerifySchema), controller.verify);

module.exports = router;
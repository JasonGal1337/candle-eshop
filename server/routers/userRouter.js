const express = require("express");
const controller = require("../controllers/userController");
const  validate  = require("../validate");
const {
  userSignupSchema,
  userLoginSchema,
  userVerifySchema,
  userEditInfoSchema,
  getUserInfoSchema,
} = require("../validators/userValidator");

const router = express.Router();

router.post("/signup",      validate(userSignupSchema),     controller.signup);
router.post("/login",       validate(userLoginSchema),      controller.login);
router.post("/verify",      validate(userVerifySchema),     controller.verify);
router.post("/editInfo",    validate(userEditInfoSchema),   controller.editInfo);
router.post("/getUserInfo", validate(getUserInfoSchema),    controller.getUserInfo);

module.exports = router;
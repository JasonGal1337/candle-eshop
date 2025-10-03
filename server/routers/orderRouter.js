const express = require("express");
const ctrl = require("../controllers/orderController");
const validate = require("../validate");
const order = require("../validators/orderValidator");

const router = express.Router();

router.post("/", validate(order.create, "body"), ctrl.create);
router.get("/:id", validate(order.orderIdParam, "params"), ctrl.get);
router.get("/user/:userId", validate(order.userIdParam, "params"), ctrl.listForUser);

module.exports = router;
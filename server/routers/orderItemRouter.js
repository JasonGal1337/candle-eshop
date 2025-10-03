const express = require("express");
const ctrl = require("../controllers/orderItemController");
const validate = require("../validate");
const orderItem = require("../validators/orderItemValidator");
const { idParam } = require("../validators/common");

const router = express.Router();

router.get("/order/:orderId", validate(orderItem.orderIdParam, "params"), ctrl.listForOrder);
router.delete("/:id", validate(idParam, "params"), ctrl.remove);

module.exports = router;
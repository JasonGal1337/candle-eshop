const express = require("express");
const ctrl = require("../controllers/orderItemController");
const router = express.Router();

router.get("/order/:orderId", ctrl.listForOrder);
router.delete("/:id", ctrl.remove);

module.exports = router;
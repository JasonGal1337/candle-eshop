const express = require("express");
const ctrl = require("../controllers/productImageController");
const router = express.Router();

router.get("/product/:productId", ctrl.listForProduct);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;
const express = require("express");
const ctrl = require("../controllers/reviewController");
const router = express.Router();

router.get("/product/:productId", ctrl.listForProduct);
router.post("/", ctrl.create);
router.delete("/:id", ctrl.remove);

module.exports = router;
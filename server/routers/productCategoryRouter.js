const express = require("express");
const ctrl = require("../controllers/productCategoryController");
const router = express.Router();

router.get("/", ctrl.list);
router.get("/product/:productId", ctrl.listForProduct);
router.get("/category/:categoryId", ctrl.listForCategory);

router.post("/", ctrl.create);
router.delete("/:productId/:categoryId", ctrl.remove);

module.exports = router;
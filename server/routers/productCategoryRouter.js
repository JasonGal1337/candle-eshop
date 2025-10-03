const express = require("express");
const ctrl = require("../controllers/productCategoryController");
const validate = require("../validate");
const pc = require("../validators/productCategoryValidator");

const router = express.Router();

router.get("/", ctrl.list);
router.get("/product/:productId", validate(pc.productIdParam, "params"), ctrl.listForProduct);
router.get("/category/:categoryId", validate(pc.categoryIdParam, "params"), ctrl.listForCategory);

router.post("/", validate(pc.link, "body"), ctrl.create);
router.delete("/:productId/:categoryId", validate(pc.keyParams, "params"), ctrl.remove);

module.exports = router;
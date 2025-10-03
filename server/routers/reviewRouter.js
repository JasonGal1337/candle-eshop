const express = require("express");
const ctrl = require("../controllers/reviewController");
const validate = require("../validate");
const review = require("../validators/reviewValidator");
const { idParam } = require("../validators/common");
const { z } = require("zod");

const router = express.Router();
const productIdParam = z.object({ productId: z.coerce.number().int().positive() });

router.get("/product/:productId", validate(productIdParam, "params"), ctrl.listForProduct);
router.post("/", validate(review.create, "body"), ctrl.create);
router.delete("/:id", validate(idParam, "params"), ctrl.remove);

module.exports = router;
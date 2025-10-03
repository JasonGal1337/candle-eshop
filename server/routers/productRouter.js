const express = require("express");
const ctrl = require("../controllers/productController");
const validate = require("../validate");
const { idParam, pagination } = require("../validators/common");
const product = require("../validators/productValidator");
const { z } = require("zod");
const slugParam = z.object({
  slug: z.string().min(1, "Slug is required"),
});
const router = express.Router();

router.get("/", validate(pagination, "query"), ctrl.list);
router.get("/slug/:slug", validate(slugParam, "params"), ctrl.getBySlug);
router.get("/:id", validate(idParam, "params"), ctrl.get);
router.post("/", validate(product.create, "body"), ctrl.create);
router.put(
  "/:id",
  validate(idParam, "params"),
  validate(product.update, "body"),
  ctrl.update
);
router.delete("/:id", validate(idParam, "params"), ctrl.remove);

module.exports = router;
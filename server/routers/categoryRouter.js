const express = require("express");
const ctrl = require("../controllers/categoryController");
const validate = require("../validate");
const { idParam, pagination } = require("../validators/common");
const category = require("../validators/categoryValidator");
const { z } = require("zod");

const router = express.Router();
const slugParam = z.object({ slug: z.string().min(1) });

router.get("/", validate(pagination, "query"), ctrl.list);
router.get("/slug/:slug", validate(slugParam, "params"), ctrl.getBySlug);
router.get("/:id", validate(idParam, "params"), ctrl.get);
router.post("/", validate(category.create, "body"), ctrl.create);
router.put("/:id", validate(idParam, "params"), validate(category.update, "body"), ctrl.update);
router.delete("/:id", validate(idParam, "params"), ctrl.remove);

module.exports = router;
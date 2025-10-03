const express = require("express");
const ctrl = require("../controllers/categoryController");
const validate = require("../validate");
const { idParam, pagination } = require("../validators/common");
const { create: categoryCreate, update: categoryUpdate } = require("../validators/categoryValidator"); // <— key change
const { z } = require("zod");

const router = express.Router();
const slugParam = z.object({ slug: z.string().min(1) });

router.get("/", validate(pagination, "query"), ctrl.list);
router.get("/slug/:slug", validate(slugParam, "params"), ctrl.getBySlug);
router.get("/:id", validate(idParam, "params"), ctrl.get);
router.post("/", validate(categoryCreate, "body"), ctrl.create);       // <— use categoryCreate
router.put("/:id", validate(idParam, "params"), validate(categoryUpdate, "body"), ctrl.update); // <— use categoryUpdate
router.delete("/:id", validate(idParam, "params"), ctrl.remove);

module.exports = router;
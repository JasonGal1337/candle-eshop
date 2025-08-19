const express = require("express");
const ctrl = require("../controllers/categoryController");
const router = express.Router();

router.get("/", ctrl.list);
router.get("/:id", ctrl.get);
router.get("/slug/:slug", ctrl.getBySlug);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;
const express = require("express");
const ctrl = require("../controllers/cartItemController");
const router = express.Router();

router.post("/", ctrl.create);
router.patch("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;
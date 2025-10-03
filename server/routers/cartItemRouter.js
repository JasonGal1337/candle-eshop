const express = require("express");
const ctrl = require("../controllers/cartItemController");
const validate = require("../validate");
const { idParam } = require("../validators/common");
const cartItem = require("../validators/cartItemValidator");

const router = express.Router();

router.post("/", validate(cartItem.create, "body"), ctrl.create);
router.patch("/:id", validate(idParam, "params"), validate(cartItem.update, "body"), ctrl.update);
router.delete("/:id", validate(idParam, "params"), ctrl.remove);

module.exports = router;
const express = require("express");
const ctrl = require("../controllers/cartController");
const validate = require("../validate");
const cart = require("../validators/cartValidator");

const router = express.Router();

router.get("/by-session/:sessionId", validate(cart.sessionParam, "params"), ctrl.getBySession);
router.get("/by-user/:userId", validate(cart.userParam, "params"), ctrl.getByUser);

router.post("/", validate(cart.create, "body"), ctrl.create);
router.post("/:cartId/add", validate(cart.cartIdParam, "params"), validate(cart.addItemBody, "body"), ctrl.addItem);
router.patch("/:cartId/item/:itemId", validate(cart.cartIdParam, "params"), validate(cart.itemParam, "params"), validate(cart.updateItemBody, "body"), ctrl.updateItem);
router.delete("/:cartId/item/:itemId", validate(cart.cartIdParam, "params"), validate(cart.itemParam, "params"), ctrl.removeItem);
router.delete("/:cartId/clear", validate(cart.cartIdParam, "params"), ctrl.clear);

module.exports = router;
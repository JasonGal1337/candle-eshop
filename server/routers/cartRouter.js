const express = require("express");
const ctrl = require("../controllers/cartController");
const router = express.Router();

router.get("/by-session/:sessionId", ctrl.getBySession);
router.get("/by-user/:userId", ctrl.getByUser);

router.post("/", ctrl.create);
router.post("/:cartId/add", ctrl.addItem);
router.patch("/:cartId/item/:itemId", ctrl.updateItem);
router.delete("/:cartId/item/:itemId", ctrl.removeItem);
router.delete("/:cartId/clear", ctrl.clear);

module.exports = router;
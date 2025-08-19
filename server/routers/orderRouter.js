const express = require("express");
const ctrl = require("../controllers/orderController");
const router = express.Router();

router.post("/", ctrl.create);
router.get("/:id", ctrl.get);
router.get("/user/:userId", ctrl.listForUser);

module.exports = router;
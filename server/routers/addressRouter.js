const express = require("express");
const ctrl = require("../controllers/addressController");
const router = express.Router();

router.get("/user/:userId", ctrl.listForUser);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;
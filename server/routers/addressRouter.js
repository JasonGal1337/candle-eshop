const express = require("express");
const ctrl = require("../controllers/addressController");
const validate = require("../validate");
const { z } = require("zod");
const address = require("../validators/addressValidator");
const { idParam } = require("../validators/common");

const router = express.Router();
const userIdParam = z.object({ userId: z.coerce.number().int().positive() });

router.get("/user/:userId", validate(userIdParam, "params"), ctrl.listForUser);
router.post("/", validate(address.create, "body"), ctrl.create);
router.put("/:id", validate(idParam, "params"), validate(address.update, "body"), ctrl.update);
router.delete("/:id", validate(idParam, "params"), ctrl.remove);

module.exports = router;
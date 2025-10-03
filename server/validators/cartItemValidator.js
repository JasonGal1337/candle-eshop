const { z } = require("zod");

const create = z.object({
  cartId: z.coerce.number().int().positive(),
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().min(1),
});

const update = z.object({
  quantity: z.coerce.number().int().min(1),
});

module.exports = { create, update };
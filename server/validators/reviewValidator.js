const { z } = require("zod");

const create = z.object({
  productId: z.coerce.number().int().positive(),
  userId: z.coerce.number().int().positive(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().optional().default(""),
});

module.exports = { create };
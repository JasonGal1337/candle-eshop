const { z } = require("zod");

const link = z.object({
  productId: z.coerce.number().int().positive(),
  categoryId: z.coerce.number().int().positive(),
});

const keyParams = z.object({
  productId: z.coerce.number().int().positive(),
  categoryId: z.coerce.number().int().positive(),
});

const productIdParam = z.object({ productId: z.coerce.number().int().positive() });
const categoryIdParam = z.object({ categoryId: z.coerce.number().int().positive() });

module.exports = { link, keyParams, productIdParam, categoryIdParam };
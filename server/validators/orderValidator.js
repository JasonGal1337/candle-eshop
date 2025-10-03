const { z } = require("zod");

const item = z.object({
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().min(1),
});

const shipping = z.object({
  name: z.string().min(1).optional(),
  line1: z.string().min(1).optional(),
  line2: z.string().trim().optional(),
  city: z.string().min(1).optional(),
  postalCode: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
}).partial();

const create = z.object({
  userId: z.coerce.number().int().positive().optional(),
  email: z.string().email().optional(),
  items: z.array(item).min(1),
  shipping: shipping.optional(),
}).refine(v => v.userId || v.email, { message: "userId or email is required" });

const orderIdParam = z.object({ id: z.coerce.number().int().positive() });
const userIdParam = z.object({ userId: z.coerce.number().int().positive() });

module.exports = { create, orderIdParam, userIdParam };
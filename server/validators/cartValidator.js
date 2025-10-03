const { z } = require("zod");

const create = z.object({
  userId: z.coerce.number().int().positive().optional(),
  sessionId: z.string().min(1).optional(),
}).refine(v => v.userId || v.sessionId, { message: "userId or sessionId is required" });

const addItemBody = z.object({
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().min(1),
});

const updateItemBody = z.object({
  quantity: z.coerce.number().int().min(1),
});

const cartIdParam = z.object({ cartId: z.coerce.number().int().positive() });
const itemParam = z.object({ itemId: z.coerce.number().int().positive() });
const sessionParam = z.object({ sessionId: z.string().min(1) });
const userParam = z.object({ userId: z.coerce.number().int().positive() });

module.exports = { create, addItemBody, updateItemBody, cartIdParam, itemParam, sessionParam, userParam };
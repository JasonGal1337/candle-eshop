const { z } = require("zod");

// /:id — coerce to number and require positive integer
const idParam = z.object({
  id: z.coerce.number().int().positive(),
});

// ?page&limit&q&sort — parsed and defaulted
const pagination = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().optional(),
  sort: z.string().trim().optional(), // e.g. "createdAt:desc"
});

module.exports = { idParam, pagination };
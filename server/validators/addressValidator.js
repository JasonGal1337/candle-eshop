const { z } = require("zod");

const create = z.object({
  userId: z.coerce.number().int().positive(),
  line1: z.string().min(1),
  line2: z.string().trim().optional().default(""),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
  isDefault: z.coerce.boolean().optional().default(false),
});

const update = z.object({
  line1: z.string().min(1).optional(),
  line2: z.string().trim().optional(),
  city: z.string().min(1).optional(),
  postalCode: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  isDefault: z.coerce.boolean().optional(),
}).refine(v => Object.keys(v).length > 0, { message: "Provide at least one field to update" });

module.exports = { create, update };
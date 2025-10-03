const { z } = require("zod");

const create = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().trim().optional().default(""),
});

const update = z
  .object({
    name: z.string().min(1).optional(),
    description: z.string().trim().optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "Provide at least one field to update",
  });

module.exports = { create, update };
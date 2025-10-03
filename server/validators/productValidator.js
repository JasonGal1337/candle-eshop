const { z } = require("zod");

const create = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().trim().optional().default(""),
  price: z.coerce.number().positive("Price must be a positive number"),
  stock: z.coerce.number().int().min(0).default(0),
  sku: z.string().trim().min(1).optional(),
  imageUrls: z.array(z.string().url()).optional(), // if you accept URLs
  categoryIds: z.array(z.coerce.number().int().positive()).optional(),
});

const update = z
  .object({
    name: z.string().min(1).optional(),
    description: z.string().trim().optional(),
    price: z.coerce.number().positive().optional(),
    stock: z.coerce.number().int().min(0).optional(),
    sku: z.string().trim().min(1).optional(),
    imageUrls: z.array(z.string().url()).optional(),
    categoryIds: z.array(z.coerce.number().int().positive()).optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "Provide at least one field to update",
  });

module.exports = { create, update };
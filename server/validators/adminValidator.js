const { z } = require("zod");

const adminSignupSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(8),
});

const adminLoginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
});

const adminVerifySchema = z.object({
  token: z.string().min(10),
});

module.exports = {
  adminSignupSchema,
  adminLoginSchema,
  adminVerifySchema,
};
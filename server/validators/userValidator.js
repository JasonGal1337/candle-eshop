const { z } = require("zod");

// allow Greek letters & common name chars
const nameRegex = /^[A-Za-zΑ-Ωα-ω\s'-]+$/u;

const userSignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).regex(nameRegex, "Only letters, spaces, ' and -"),
  surname: z.string().min(1).regex(nameRegex, "Only letters, spaces, ' and -"),
});

const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const userVerifySchema = z.object({
  token: z.string().min(10),
});

const userEditInfoSchema = z
  .object({
    token: z.string().min(10),
    name: z.string().min(1).regex(nameRegex).optional(),
    surname: z.string().min(1).regex(nameRegex).optional(),
  })
  .refine((d) => d.name || d.surname, {
    message: "Provide at least one field to update",
    path: ["name"],
  });

const getUserInfoSchema = z.object({
  token: z.string().min(10),
});

module.exports = {
  userSignupSchema,
  userLoginSchema,
  userVerifySchema,
  userEditInfoSchema,
  getUserInfoSchema,
};
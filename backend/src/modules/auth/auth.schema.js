const { z } = require("zod");

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

const loginSchema = registerSchema;

const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

module.exports = { registerSchema, loginSchema, refreshSchema };

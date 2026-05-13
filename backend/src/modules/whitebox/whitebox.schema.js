const { z } = require("zod");

const analyzeSchema = z.object({
  conversationId: z.string().uuid().optional(),
  coverageType: z.enum(["STATEMENT", "BRANCH", "PATH"]),
  sourceCode: z.string().min(1),
  uiCode: z.string().optional(),
});

const scriptSchema = z.object({
  analysis: z.any(),
});

module.exports = { analyzeSchema, scriptSchema };

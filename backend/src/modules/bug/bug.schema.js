const { z } = require("zod");

const bugExplainSchema = z.object({
  stackTrace: z.string().min(1),
  context: z.string().optional(),
});

module.exports = { bugExplainSchema };

const { z } = require("zod");

const generateSchema = z.object({
  conversationId: z.uuid().optional(),
  method: z.enum(["BVA", "EQP", "DT"]),
  requirement: z.string().min(1),
});

const scriptSchema = z.object({
  conversationId: z.uuid().optional(),
  testCases: z.array(z.any()).min(1),
});

const exportSchema = z.object({
  format: z.enum(["PDF", "DOCX", "JSON", "ZIP", "XLSX"]),
  payload: z.any(),
});

module.exports = { generateSchema, scriptSchema, exportSchema };

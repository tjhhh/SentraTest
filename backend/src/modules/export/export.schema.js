const { z } = require("zod");

const exportPayloadSchema = z.object({
  format: z.enum(["PDF", "DOCX", "JSON", "ZIP", "XLSX"]),
  payload: z.any(),
  fileName: z.string().min(1).optional(),
});

module.exports = { exportPayloadSchema };

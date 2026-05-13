const { z } = require("zod");

const chatSchema = z.object({
  conversationId: z.string().uuid(),
  message: z.string().min(1),
  stream: z.boolean().optional().default(false),
});

module.exports = { chatSchema };

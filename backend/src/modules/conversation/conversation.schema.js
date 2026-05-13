const { z } = require("zod");

const createConversationSchema = z.object({
  title: z.string().min(1).max(120),
});

const renameConversationSchema = z.object({
  title: z.string().min(1).max(120),
});

module.exports = { createConversationSchema, renameConversationSchema };

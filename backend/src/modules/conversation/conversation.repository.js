const { prisma } = require("../../config/prisma");

function listConversationsByUser(userId) {
  return prisma.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

function createConversation({ userId, title }) {
  return prisma.conversation.create({
    data: { userId, title },
  });
}

function getConversationById(id) {
  return prisma.conversation.findUnique({ where: { id } });
}

function renameConversation({ id, title }) {
  return prisma.conversation.update({
    where: { id },
    data: { title },
  });
}

function deleteConversation(id) {
  return prisma.conversation.delete({ where: { id } });
}

function createMessage({ conversationId, role, content }) {
  return prisma.message.create({
    data: { conversationId, role, content },
  });
}

function listMessages(conversationId) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });
}

module.exports = {
  listConversationsByUser,
  createConversation,
  getConversationById,
  renameConversation,
  deleteConversation,
  createMessage,
  listMessages,
};

const repo = require("./conversation.repository");
const { sseService } = require("../../services/sse/sse.service");

async function assertOwnership(conversationId, userId) {
  const conversation = await repo.getConversationById(conversationId);
  if (!conversation || conversation.userId !== userId) {
    const err = new Error("Conversation not found");
    err.status = 404;
    throw err;
  }

  return conversation;
}

async function getConversations(userId) {
  return repo.listConversationsByUser(userId);
}

async function createConversation(userId, title) {
  return repo.createConversation({ userId, title });
}

async function renameConversation(conversationId, userId, title) {
  await assertOwnership(conversationId, userId);
  return repo.renameConversation({ id: conversationId, title });
}

async function removeConversation(conversationId, userId) {
  await assertOwnership(conversationId, userId);
  await repo.deleteConversation(conversationId);
}

async function addMessage({ conversationId, userId, role, content }) {
  await assertOwnership(conversationId, userId);
  const message = await repo.createMessage({ conversationId, role, content });
  sseService.publish(conversationId, "message", message);
  return message;
}

async function getMessages(conversationId, userId) {
  await assertOwnership(conversationId, userId);
  return repo.listMessages(conversationId);
}

module.exports = {
  getConversations,
  createConversation,
  renameConversation,
  removeConversation,
  addMessage,
  getMessages,
};

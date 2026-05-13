/**
 * Context Manager — Manages multi-turn conversation context for the chatbot.
 * Loads history from the database, formats it, and enforces token-aware windowing.
 */
const repo = require('../data/repository');

const MAX_HISTORY_MESSAGES = 10;

/**
 * Load conversation messages for a chat session.
 * Returns the last N messages formatted for prompt inclusion.
 *
 * @param {string} chatId - The chat session UUID
 * @param {number} [maxMessages] - Max messages to include (default: 10)
 * @returns {Promise<Array<{role: string, content: string}>>}
 */
async function loadChatMessages(chatId, maxMessages = MAX_HISTORY_MESSAGES) {
  const messages = await repo.listMessagesByChat(chatId, maxMessages, 0);

  return messages.map(m => ({
    role: m.role,
    content: m.content,
  }));
}

/**
 * Load chat-level metadata such as stored context.
 *
 * @param {string} chatId - The chat session UUID
 * @returns {Promise<object|null>}
 */
async function loadChatMetadata(chatId) {
  const chat = await repo.getChatById(chatId);
  return chat ? chat.context : null;
}

/**
 * Build the full conversation history for a chat prompt.
 * Loads stored context and recent messages from DB.
 *
 * @param {string} chatId - The chat session UUID
 * @returns {Promise<{context: object|null, history: Array<{role: string, content: string}>}>}
 */
async function buildConversationHistory(chatId) {
  const [context, history] = await Promise.all([
    loadChatMetadata(chatId),
    loadChatMessages(chatId, MAX_HISTORY_MESSAGES),
  ]);

  return { context, history };
}

module.exports = {
  buildConversationHistory,
  MAX_HISTORY_MESSAGES,
};

/**
 * Context Manager — Manages multi-turn conversation context for the chatbot.
 * Loads history from the database, formats it, and enforces token-aware windowing.
 */
const repo = require('../data/repository');

const MAX_HISTORY_MESSAGES = 10;

/**
 * Load conversation context for a chat session.
 * Returns the last N messages formatted for prompt inclusion.
 *
 * @param {string} chatId - The chat session UUID
 * @param {number} [maxMessages] - Max messages to include (default: 10)
 * @returns {Promise<Array<{role: string, content: string}>>}
 */
async function loadChatContext(chatId, maxMessages = MAX_HISTORY_MESSAGES) {
  const messages = await repo.listMessagesByChat(chatId, maxMessages, 0);

  return messages.map(m => ({
    role: m.role,
    content: m.content,
  }));
}

/**
 * Build the full conversation history for a chat prompt.
 * Loads messages from DB and formats them.
 *
 * @param {string} chatId - The chat session UUID
 * @returns {Promise<Array<{role: string, content: string}>>}
 */
async function buildConversationHistory(chatId) {
  return loadChatContext(chatId, MAX_HISTORY_MESSAGES);
}

module.exports = {
  loadChatContext,
  buildConversationHistory,
  MAX_HISTORY_MESSAGES,
};

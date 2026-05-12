/**
 * AI Service — Public API surface.
 * Composes all AI modules (client, prompts, validation, queue, rate limiter, cache, context).
 */
const { generateContent, getStatus } = require('./geminiClient');
const {
  buildBVAPrompt, buildECPPrompt, buildWhiteBoxPrompt,
  buildBugExplainerPrompt, buildChatPrompt,
} = require('./promptTemplates');
const {
  processTestCaseResponse, processBugExplainerResponse,
} = require('./responseValidator');
const { queue } = require('./requestQueue');
const { rateLimiter } = require('./rateLimiter');
const { cache } = require('./cache');
const { buildConversationHistory } = require('./contextManager');
const repo = require('../data/repository');

// ---------------------------------------------------------------------------
// Internal: Rate-limited, queued AI call
// ---------------------------------------------------------------------------
async function _callAI(prompt) {
  await rateLimiter.acquire();
  return generateContent(prompt);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate test cases using the specified method.
 *
 * @param {string} method - 'bva' | 'ecp' | 'whitebox'
 * @param {object} input - Input parameters for the prompt
 * @param {string} input.featureDescription - Feature description (bva/ecp)
 * @param {string} [input.inputFields] - Input fields (bva/ecp)
 * @param {string} [input.constraints] - Constraints (bva)
 * @param {string} [input.sourceCode] - Source code (whitebox)
 * @param {string} [input.language] - Programming language (whitebox)
 * @param {string} [input.moduleName] - Module name for TC IDs
 * @returns {Promise<{result: object, queuePosition: number, queueLength: number}>}
 */
async function generateTestCases(method, input) {
  const methodLower = method.toLowerCase();
  const moduleName = input.moduleName || 'GEN';

  // Build prompt
  let prompt;
  let isWhiteBox = false;
  switch (methodLower) {
    case 'bva':
      prompt = buildBVAPrompt(input);
      break;
    case 'ecp':
      prompt = buildECPPrompt(input);
      break;
    case 'whitebox':
      prompt = buildWhiteBoxPrompt(input);
      isWhiteBox = true;
      break;
    default:
      throw new Error(`Unknown test case method: ${method}. Supported: bva, ecp, whitebox`);
  }

  // Check cache
  const cacheKey = cache.makeKey(methodLower, JSON.stringify(input));
  const cached = cache.get(cacheKey);
  if (cached) {
    return {
      result: { ...cached, fromCache: true },
      queuePosition: 0,
      queueLength: 0,
    };
  }

  // Enqueue for sequential processing
  const { result, queuePosition, queueLength } = await queue.enqueue(async () => {
    const responseText = await _callAI(prompt);
    return processTestCaseResponse(responseText, { moduleName, isWhiteBox });
  });

  // Cache the result (only if we got test cases)
  if (result.testCases && result.testCases.length > 0) {
    cache.set(cacheKey, result);
  }

  return { result, queuePosition, queueLength };
}

/**
 * Explain a bug/error log using AI.
 *
 * @param {string} errorLog - The error log text
 * @param {object} [options]
 * @param {string} [options.language] - Response language (default: 'Bahasa Indonesia')
 * @returns {Promise<{result: object, queuePosition: number, queueLength: number}>}
 */
async function explainBug(errorLog, options = {}) {
  const prompt = buildBugExplainerPrompt({ errorLog, language: options.language });

  // Check cache
  const cacheKey = cache.makeKey('bug', errorLog);
  const cached = cache.get(cacheKey);
  if (cached) {
    return {
      result: { ...cached, fromCache: true },
      queuePosition: 0,
      queueLength: 0,
    };
  }

  const { result, queuePosition, queueLength } = await queue.enqueue(async () => {
    const responseText = await _callAI(prompt);
    return processBugExplainerResponse(responseText);
  });

  if (result.result) {
    cache.set(cacheKey, result);
  }

  return { result, queuePosition, queueLength };
}

/**
 * Chat with the AI assistant in a conversation session.
 *
 * @param {string} chatId - The chat session UUID
 * @param {string} userId - The user UUID
 * @param {string} message - The user's message
 * @returns {Promise<{reply: string, queuePosition: number, queueLength: number}>}
 */
async function chat(chatId, userId, message) {
  // Save user message to DB
  await repo.addMessage(chatId, userId, 'user', message);

  // Load conversation history
  const history = await buildConversationHistory(chatId);

  // Build prompt with context
  const prompt = buildChatPrompt({ userMessage: message, history });

  // No caching for chat (conversations are unique)
  const { result: reply, queuePosition, queueLength } = await queue.enqueue(async () => {
    return _callAI(prompt);
  });

  // Save assistant reply to DB
  await repo.addMessage(chatId, userId, 'assistant', reply);

  return { reply, queuePosition, queueLength };
}

/**
 * Get the status of the AI service.
 * @returns {{ available: boolean, error?: string, queue: object, rateLimit: object, cacheSize: number }}
 */
function status() {
  const aiStatus = getStatus();
  return {
    ...aiStatus,
    queue: { length: queue.length, processing: queue.isProcessing },
    rateLimit: rateLimiter.getUsage(),
    cacheSize: cache.size,
  };
}

module.exports = {
  generateTestCases,
  explainBug,
  chat,
  status,
  // Expose sub-modules for advanced usage
  cache,
  queue,
  rateLimiter,
};

const conversationService = require("../conversation/conversation.service");
const conversationRepo = require("../conversation/conversation.repository");
const { buildPrompt } = require("../../services/ai/promptOrchestrator.service");
const { generateText, streamText } = require("../../services/ai/gemini.service");
const { parseJsonSafe, normalizeGenerationOutput } = require("../../services/ai/outputParser.service");

async function getChatHistory(userId) {
  const conversations = await conversationRepo.listConversationsByUser(userId);
  return conversations;
}

async function chat({ userId, conversationId, message, requestId }) {
  await conversationService.addMessage({
    conversationId,
    userId,
    role: "USER",
    content: message,
  });

  const history = await conversationService.getMessages(conversationId, userId);
  const prompt = buildPrompt({ mode: "chat", input: message, context: history.slice(-8) });
  const result = await generateText(prompt, requestId);
  const parsed = parseJsonSafe(result.text);
  const normalized = normalizeGenerationOutput("chat", parsed);
  const assistantText = typeof normalized.content === "string"
    ? normalized.content
    : JSON.stringify(normalized.content);

  const assistantMessage = await conversationService.addMessage({
    conversationId,
    userId,
    role: "ASSISTANT",
    content: assistantText,
  });

  return { result: normalized, assistantMessage, aiMeta: result };
}

async function streamChat({ res, userId, conversationId, message, requestId }) {
  await conversationService.addMessage({
    conversationId,
    userId,
    role: "USER",
    content: message,
  });

  const history = await conversationService.getMessages(conversationId, userId);
  const prompt = buildPrompt({ mode: "chat-stream", input: message, context: history.slice(-8) });

  let full = "";
  for await (const chunk of streamText(prompt, requestId)) {
    full += chunk;
    res.write(`event: chunk\ndata: ${JSON.stringify({ chunk })}\n\n`);
  }

  await conversationService.addMessage({
    conversationId,
    userId,
    role: "ASSISTANT",
    content: full,
  });

  res.write(`event: done\ndata: ${JSON.stringify({ done: true })}\n\n`);
  res.end();
}

module.exports = { getChatHistory, chat, streamChat };

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { env } = require("../../config/env");
const { appLogger } = require("../../config/logger");

let model = null;
if (env.GEMINI_API_KEY) {
  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: env.GEMINI_MODEL });
}

async function generateText(prompt, requestId = "unknown") {
  const startedAt = Date.now();
  if (!model) {
    appLogger.warn("GEMINI_API_KEY not set, using fallback AI response", { requestId });
    return {
      text: JSON.stringify({ answer: "Fallback response", prompt }),
      latencyMs: Date.now() - startedAt,
      provider: "fallback",
      requestId,
    };
  }

  try {
    const response = await model.generateContent(prompt);
    const text = response.response.text();
    const latencyMs = Date.now() - startedAt;
    appLogger.info("AI generation successful", { requestId, latencyMs });
    return {
      text,
      latencyMs,
      provider: "gemini",
      requestId,
    };
  } catch (error) {
    const latencyMs = Date.now() - startedAt;
    const errorType = error.message?.includes("quota") ? "QUOTA_EXCEEDED" : "API_ERROR";
    appLogger.error("AI generation failed", { requestId, errorType, message: error.message, latencyMs });
    throw error;
  }
}

async function* streamText(prompt, requestId = "unknown") {
  const startedAt = Date.now();
  if (!model) {
    const fallback = `Fallback stream: ${prompt.slice(0, 120)}`;
    for (const chunk of fallback.split(" ")) {
      yield `${chunk} `;
    }
    return;
  }

  try {
    const stream = await model.generateContentStream(prompt);
    for await (const chunk of stream.stream) {
      yield chunk.text();
    }
    appLogger.info("AI streaming successful", { requestId, latencyMs: Date.now() - startedAt });
  } catch (error) {
    const errorType = error.message?.includes("quota") ? "QUOTA_EXCEEDED" : "API_ERROR";
    appLogger.error("AI streaming failed", { requestId, errorType, message: error.message });
    throw error;
  }
}

module.exports = { generateText, streamText };

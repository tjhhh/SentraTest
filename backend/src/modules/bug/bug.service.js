const { buildPrompt } = require("../../services/ai/promptOrchestrator.service");
const { generateText } = require("../../services/ai/gemini.service");
const { parseJsonSafe, normalizeGenerationOutput } = require("../../services/ai/outputParser.service");
const { createBugReport } = require("./bug.repository");

async function explain({ userId, stackTrace, context, requestId }) {
  const prompt = buildPrompt({
    mode: "bug-explain",
    input: `Stack trace:\n${stackTrace}\n\nContext:\n${context || "none"}`,
  });

  const ai = await generateText(prompt, requestId);
  const parsed = parseJsonSafe(ai.text);
  const analysis = normalizeGenerationOutput("bug-explain", parsed);

  await createBugReport({ userId, stackTrace, analysis });
  return analysis;
}

module.exports = { explain };

const { buildPrompt } = require("../../services/ai/promptOrchestrator.service");
const { generateText } = require("../../services/ai/gemini.service");
const { parseJsonSafe, normalizeGenerationOutput } = require("../../services/ai/outputParser.service");
const { createTestCase } = require("./whitebox.repository");

async function analyze({ userId, conversationId, coverageType, sourceCode, requestId }) {
  const prompt = buildPrompt({
    mode: "whitebox-analyze",
    input: sourceCode,
    method: coverageType,
  });

  const ai = await generateText(prompt, requestId);
  const parsed = parseJsonSafe(ai.text);
  const output = normalizeGenerationOutput("whitebox", parsed);

  await createTestCase({
    userId,
    conversationId,
    type: "WHITEBOX",
    coverageType,
    payload: output,
  });

  return output;
}

function script({ analysis }) {
  const scriptContent = `import { test } from '@playwright/test';\n\n` +
    `test('whitebox generated test', async ({ page }) => {\n` +
    `  console.log(${JSON.stringify(JSON.stringify(analysis))});\n` +
    `  await page.goto('http://localhost:3000');\n` +
    `});\n`;

  return { script: scriptContent };
}

module.exports = { analyze, script };

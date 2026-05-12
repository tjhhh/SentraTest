const { buildPrompt } = require("../../services/ai/promptOrchestrator.service");
const { generateText } = require("../../services/ai/gemini.service");
const { parseJsonSafe, normalizeGenerationOutput } = require("../../services/ai/outputParser.service");
const { createTestCase } = require("./blackbox.repository");

async function generate({ userId, conversationId, method, requirement, requestId }) {
  const prompt = buildPrompt({
    mode: "blackbox-generate",
    input: requirement,
    method,
  });

  const ai = await generateText(prompt, requestId);
  const parsed = parseJsonSafe(ai.text);
  const output = normalizeGenerationOutput("blackbox", parsed);

  await createTestCase({
    userId,
    conversationId,
    type: `BLACKBOX_${method}`,
    payload: output,
  });

  return output;
}

async function generateScript({ method, testCases }) {
  const body = JSON.stringify(testCases, null, 2);
  const script = `import { test, expect } from '@playwright/test';\n\n` +
    `test('${method} generated scenario', async ({ page }) => {\n` +
    `  // Replace with generated steps from testCases payload\n` +
    `  console.log(${JSON.stringify(body)});\n` +
    `  await page.goto('http://localhost:3000');\n` +
    `  await expect(page).toHaveTitle(/.*/);\n` +
    `});\n`;

  return { script };
}

module.exports = { generate, generateScript };

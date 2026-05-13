const { generateText, sanitizeJsonString } = require("./geminiService");

/**
 * Analyze functional requirement and generate Decision Table using Gemini API
 * @param {string} requirement 
 * @returns {Promise<Object>}
 */
async function generateDecisionTable(requirement) {
  const systemPrompt = `You are an expert QA engineer specializing in Decision Table Testing.
Analyze the following requirement and generate a comprehensive Decision Table.

REQUIREMENT:
${requirement}

Your goal is to identify all logical conditions and the resulting actions/outcomes.

Return ONLY a valid JSON object (no other text, no markdown, no code blocks). Return structured JSON objects for conditions, actions, and testCases, not string representations of objects.

Format:
{
  "conditions": [
    {"id": "c1", "name": "Condition name", "description": "Short description"}
  ],
  "actions": [
    {"id": "a1", "name": "Action name", "description": "Short description"}
  ],
  "testCases": [
    {
      "id": "tc1",
      "name": "Scenario name",
      "conditions": {"c1": true, "c2": false},
      "expectedActions": ["a1"],
      "description": "Why this combination leads to these actions",
      "category": "normal|edge|error"
    }
  ]
}

Important:
- Identify ALL conditions that affect the outcome.
- Identify ALL possible actions.
- Generate test cases covering significant combinations (use your best judgment for a complete table).
- Conditions in test cases must map condition IDs to boolean (true/false) or specific values if non-boolean.
- expectedActions must be an array of action IDs.
- Return ONLY the JSON object. No markdown markers like \`\`\`json.`;

  const responseText = await generateText(systemPrompt);
  const cleanedResponse = sanitizeJsonString(responseText);
  const data = JSON.parse(cleanedResponse);
  const normalized = normalizeDecisionTable(data);

  if (!normalized || !normalized.conditions || !normalized.actions || !Array.isArray(normalized.testCases)) {
    throw new Error("Invalid Decision Table format from AI");
  }

  return normalized;
}

function parsePseudoObjectString(value) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  const objectText = trimmed.startsWith("@{") && trimmed.endsWith("}")
    ? trimmed.slice(2, -1)
    : trimmed.startsWith("{") && trimmed.endsWith("}")
    ? trimmed.slice(1, -1)
    : null;

  if (!objectText) {
    return value;
  }

  const entries = objectText.split(/;\s*/).filter(Boolean);
  const parsed = {};
  for (const entry of entries) {
    const [key, ...rest] = entry.split("=");
    if (!key || rest.length === 0) continue;
    parsed[key.trim()] = rest.join("=").trim();
  }
  return parsed;
}

function normalizeDecisionTable(data) {
  const normalized = { ...data };

  if (Array.isArray(normalized.conditions)) {
    normalized.conditions = normalized.conditions.map((item) => {
      const parsed = parsePseudoObjectString(item);
      return typeof parsed === "object" ? parsed : item;
    });
  }

  if (Array.isArray(normalized.actions)) {
    normalized.actions = normalized.actions.map((item) => {
      const parsed = parsePseudoObjectString(item);
      return typeof parsed === "object" ? parsed : item;
    });
  }

  if (Array.isArray(normalized.testCases)) {
    normalized.testCases = normalized.testCases.map((item) => {
      if (typeof item === "string") {
        const parsed = parsePseudoObjectString(item);
        item = typeof parsed === "object" ? parsed : item;
      }

      if (item && typeof item === "object") {
        if (typeof item.conditions === "string") {
          item.conditions = parsePseudoObjectString(item.conditions);
        }
        if (typeof item.expectedActions === "string") {
          item.expectedActions = item.expectedActions
            .replace(/^[\[\(]/, "")
            .replace(/[\]\)]$/, "")
            .split(/,\s*/)
            .map((v) => v.trim())
            .filter(Boolean);
        }
      }

      return item;
    });
  }

  return normalized;
}

module.exports = {
  generateDecisionTable,
};

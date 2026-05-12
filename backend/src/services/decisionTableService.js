const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5",
});

function sanitizeJsonString(raw) {
  const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
  const firstBracket = Math.min(
    ...[cleaned.indexOf("{"), cleaned.indexOf("[")].filter((idx) => idx >= 0)
  );
  const lastBracket = Math.max(cleaned.lastIndexOf("}"), cleaned.lastIndexOf("]"));
  if (firstBracket >= 0 && lastBracket > firstBracket) {
    return cleaned.slice(firstBracket, lastBracket + 1);
  }
  return cleaned;
}

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

Return ONLY a valid JSON object (no other text, no markdown, no code blocks).

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

  let retries = 0;
  const maxRetries = 3;

  while (retries < maxRetries) {
    try {
      const result = await model.generateContent(systemPrompt);
      const responseText = await result.response.text();

      console.log("Decision Table Raw Response:", responseText);

      const cleanedResponse = sanitizeJsonString(responseText);
      
      const data = JSON.parse(cleanedResponse);

      // Basic validation
      if (!data.conditions || !data.actions || !data.testCases) {
        throw new Error("Invalid Decision Table format from AI");
      }

      return data;

    } catch (error) {
      retries++;
      console.error(`Gemini DT API error (Attempt ${retries}/${maxRetries}):`, error.message);
      if (retries >= maxRetries) {
        throw new Error(`Failed to generate Decision Table after ${maxRetries} attempts: ${error.message}`);
      }
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
    }
  }
}

module.exports = {
  generateDecisionTable,
};

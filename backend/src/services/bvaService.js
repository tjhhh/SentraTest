const USE_AI = process.env.USE_AI === "true";
let aiModel = null;

if (USE_AI) {
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  aiModel = genAI.getGenerativeModel({ model: "gemini-1.5" });
}

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

function parseRange(requirementText) {
  const rangeMatch = requirementText.match(/between\s+(\d+)\s*(?:and|to)\s*(\d+)/i);
  const minMatch = requirementText.match(/(?:at least|minimum|>=|not less than|not below)\s+(\d+)/i);
  const maxMatch = requirementText.match(/(?:no more than|not more than|maximum|max(?:imum)?|<=|not above)\s+(\d+)/i);
  const fieldMatch = requirementText.match(/(?:the\s+)?([a-zA-Z_]+)\s+(?:field|value|age|amount|score|number)/i);

  const field = fieldMatch ? fieldMatch[1].toLowerCase() : "value";
  let min = null;
  let max = null;

  if (rangeMatch) {
    min = Number(rangeMatch[1]);
    max = Number(rangeMatch[2]);
  }

  if (min === null && minMatch) {
    min = Number(minMatch[1]);
  }

  if (max === null && maxMatch) {
    max = Number(maxMatch[1]);
  }

  if (min !== null && max !== null && min > max) {
    [min, max] = [max, min];
  }

  return { min, max, field };
}

function createFallbackBVA(requirementText) {
  const { min, max, field } = parseRange(requirementText);
  const testCases = [];

  if (min !== null && max !== null) {
    const mid = Math.floor((min + max) / 2);
    testCases.push({
      id: "tc-001",
      name: `Minimum valid ${field}`,
      input: { [field]: min },
      expectedOutput: "Valid - accepts minimum boundary",
      boundaryType: "lower",
      category: "boundary",
    });
    testCases.push({
      id: "tc-002",
      name: `Maximum valid ${field}`,
      input: { [field]: max },
      expectedOutput: "Valid - accepts maximum boundary",
      boundaryType: "upper",
      category: "boundary",
    });
    testCases.push({
      id: "tc-003",
      name: `Just below minimum ${field}`,
      input: { [field]: min - 1 },
      expectedOutput: "Invalid - below minimum",
      boundaryType: "invalid",
      category: "invalid",
    });
    testCases.push({
      id: "tc-004",
      name: `Just above maximum ${field}`,
      input: { [field]: max + 1 },
      expectedOutput: "Invalid - exceeds maximum",
      boundaryType: "invalid",
      category: "invalid",
    });
    testCases.push({
      id: "tc-005",
      name: `Typical valid ${field}`,
      input: { [field]: mid },
      expectedOutput: "Valid - typical value within range",
      boundaryType: "exact",
      category: "valid",
    });
  } else if (min !== null) {
    testCases.push({
      id: "tc-001",
      name: `Minimum valid ${field}`,
      input: { [field]: min },
      expectedOutput: "Valid - meets minimum",
      boundaryType: "lower",
      category: "boundary",
    });
    testCases.push({
      id: "tc-002",
      name: `Just below minimum ${field}`,
      input: { [field]: min - 1 },
      expectedOutput: "Invalid - below minimum",
      boundaryType: "invalid",
      category: "invalid",
    });
    testCases.push({
      id: "tc-003",
      name: `Typical valid ${field}`,
      input: { [field]: min + 1 },
      expectedOutput: "Valid - valid value above minimum",
      boundaryType: "exact",
      category: "valid",
    });
  } else if (max !== null) {
    testCases.push({
      id: "tc-001",
      name: `Maximum valid ${field}`,
      input: { [field]: max },
      expectedOutput: "Valid - meets maximum",
      boundaryType: "upper",
      category: "boundary",
    });
    testCases.push({
      id: "tc-002",
      name: `Just above maximum ${field}`,
      input: { [field]: max + 1 },
      expectedOutput: "Invalid - exceeds maximum",
      boundaryType: "invalid",
      category: "invalid",
    });
    testCases.push({
      id: "tc-003",
      name: `Typical valid ${field}`,
      input: { [field]: Math.max(1, max - 1) },
      expectedOutput: "Valid - typical value within range",
      boundaryType: "exact",
      category: "valid",
    });
  } else {
    testCases.push({
      id: "tc-001",
      name: "Basic valid input",
      input: { [field]: 1 },
      expectedOutput: "Valid - meets requirement",
      boundaryType: "exact",
      category: "valid",
    });
    testCases.push({
      id: "tc-002",
      name: "Invalid low input",
      input: { [field]: 0 },
      expectedOutput: "Invalid - low boundary",
      boundaryType: "invalid",
      category: "invalid",
    });
    testCases.push({
      id: "tc-003",
      name: "Invalid high input",
      input: { [field]: 999 },
      expectedOutput: "Invalid - high boundary",
      boundaryType: "invalid",
      category: "invalid",
    });
  }

  return testCases;
}

async function analyzeBoundaryValues(requirementText) {
  if (!USE_AI) {
    return createFallbackBVA(requirementText);
  }

  const systemPrompt = `You are an expert QA engineer specializing in Boundary Value Analysis (BVA).
Analyze the following requirement and generate comprehensive BVA test cases.

REQUIREMENT:
${requirementText}

Identify all numerical boundaries and ranges. For each range, generate test cases for:
1. Minimum boundary value (lower boundary)
2. Maximum boundary value (upper boundary)
3. Just below minimum (invalid)
4. Just above maximum (invalid)
5. Typical valid values within range (exact)

Return ONLY a valid JSON array (no other text, no markdown, no code blocks).

Strict JSON Schema:
[
  {
    "id": "tc-001",
    "name": "Minimum boundary value for [Variable]",
    "input": {"field": 18},
    "expectedOutput": "Valid - accepts minimum boundary",
    "boundaryType": "lower",
    "category": "boundary"
  }
]

Important:
- Generate 8-15 test cases.
- boundaryType MUST be one of: "lower", "upper", "exact", "invalid".
- category MUST be one of: "valid", "boundary", "invalid".
- Return ONLY JSON array.`;

  let retries = 0;
  const maxRetries = 3;

  while (retries < maxRetries) {
    try {
      const result = await aiModel.generateContent(systemPrompt);
      const responseText = await result.response.text();
      const cleanedResponse = sanitizeJsonString(responseText);
      let testCases = JSON.parse(cleanedResponse);

      if (!Array.isArray(testCases)) {
        testCases = [testCases];
      }

      return testCases.map((tc, index) => ({
        id: tc.id || `tc-${String(index + 1).padStart(3, "0")}`,
        name: tc.name || `Test Case ${index + 1}`,
        input: tc.input || {},
        expectedOutput: tc.expectedOutput || "Success",
        boundaryType: tc.boundaryType || "exact",
        category: tc.category || "valid",
      }));
    } catch (error) {
      if (retries >= maxRetries - 1) {
        console.warn("AI generation failed, falling back to local BVA generator:", error);
        return createFallbackBVA(requirementText);
      }
      retries++;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
    }
  }
}

module.exports = {
  analyzeBoundaryValues,
};

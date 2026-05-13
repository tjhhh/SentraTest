const methodRules = {
  BVA: "Apply Boundary Value Analysis and include min, min+1, max-1, max values.",
  EQP: "Apply Equivalence Partitioning and include valid and invalid partitions.",
  DT: "Apply Decision Table testing and include condition-action matrix.",
  STATEMENT: "Generate tests that maximize statement coverage.",
  BRANCH: "Generate tests that maximize branch coverage.",
  PATH: "Generate tests that maximize independent path coverage.",
};

function buildPrompt({ mode, input, context = [], method }) {
  const contextLines = context.map((m) => `- ${m.role}: ${m.content}`).join("\n");
  const contextBlock = context.length
    ? `Context messages:\n${contextLines}`
    : "Context messages: none";

  const methodBlock = method ? `Method rules: ${methodRules[method] || method}` : "Method rules: default";

  const jsonFormatBlock = mode === "blackbox-generate" ? `
RESPOND WITH ONLY VALID JSON - NO PREAMBLE, NO EXPLANATION, NO TEXT BEFORE OR AFTER:

{
  "testCases": [
    {
      "id": "TC_001",
      "description": "clear test case description in Indonesian",
      "scenario": "what is being tested",
      "inputs": { "field1": "value1", "field2": "value2" },
      "expectedOutput": "expected result or behavior",
      "notes": "additional notes if any"
    },
    {
      "id": "TC_002",
      "description": "another test case",
      "scenario": "what is being tested",
      "inputs": { "field1": "value1" },
      "expectedOutput": "expected result",
      "notes": ""
    }
  ]
}

IMPORTANT: 
- Return ONLY JSON, nothing else
- Generate at least 4-6 test cases
- Use realistic data based on the requirement
- Make sure all JSON is valid and properly escaped` : "Output strictly as JSON with stable fields.";

  return [
    `Mode: ${mode}`,
    contextBlock,
    methodBlock,
    jsonFormatBlock,
    `Requirement to test:
${input}`,
  ].join("\n\n");
}

module.exports = { buildPrompt };

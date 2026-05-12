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

  return [
    `Mode: ${mode}`,
    contextBlock,
    methodBlock,
    "Output strictly as JSON with stable fields.",
    `User input: ${input}`,
  ].join("\n\n");
}

module.exports = { buildPrompt };

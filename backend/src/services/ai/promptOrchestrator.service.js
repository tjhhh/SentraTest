const methodSpecificInstructions = {
  BVA: {
    description: "Boundary Value Analysis",
    instructions: `
BOUNDARY VALUE ANALYSIS (BVA) - SPECIFIC INSTRUCTIONS:
========================================================

GOAL: Test values at the boundaries of input domains where errors often occur.

KEY PRINCIPLES:
1. Identify ALL numeric ranges, string lengths, dates, and collections in the requirement
2. For each boundary condition, generate test cases for:
   - Minimum value (valid)
   - Minimum - 1 (just below valid range - invalid)
   - Minimum + 1 (just above minimum - valid)
   - Maximum value (valid)
   - Maximum - 1 (just below maximum - valid)
   - Maximum + 1 (just above valid range - invalid)
3. Test edge cases: empty strings, null, zero, negative numbers, special characters
4. Include "boundary_type" in notes to indicate which boundary is tested

EXAMPLE:
Requirement: "Age field must accept integers between 1 and 100"
Test Cases:
- TC_001: Age = 0 (boundary: minimum-1) → Expected: Error
- TC_002: Age = 1 (boundary: minimum) → Expected: Success
- TC_003: Age = 2 (boundary: minimum+1) → Expected: Success
- TC_004: Age = 99 (boundary: maximum-1) → Expected: Success
- TC_005: Age = 100 (boundary: maximum) → Expected: Success
- TC_006: Age = 101 (boundary: maximum+1) → Expected: Error
- TC_007: Age = -5 (negative) → Expected: Error
- TC_008: Age = 999 (far out of range) → Expected: Error

MINIMUM TEST CASES: Generate at least 6-8 test cases covering all boundaries.

OUTPUT FORMAT: Each test case must include boundary_type in notes field.`,
  },

  EQP: {
    description: "Equivalence Partitioning",
    instructions: `
EQUIVALENCE PARTITIONING (EQP) - SPECIFIC INSTRUCTIONS:
=======================================================

GOAL: Divide input domain into partitions where all values behave similarly.
Select one representative value from each partition.

KEY PRINCIPLES:
1. Identify all input domains and constraints from requirement
2. Divide each domain into partitions:
   - VALID: Inputs that should be accepted
   - INVALID: Inputs that should be rejected (wrong format, type, etc)
   - EDGE: Boundary values between valid and invalid
3. Generate ONE test case per partition (not multiple from same partition)
4. Include "partition_type" and "partition_name" in notes

EXAMPLE:
Requirement: "Email field must be valid email format"
Partitions:
- VALID Partition: "test@example.com" → Success
- INVALID Partition (missing @): "testexample.com" → Error
- INVALID Partition (multiple @): "test@@example.com" → Error
- INVALID Partition (missing domain): "test@.com" → Error
- INVALID Partition (empty): "" → Error
- EDGE Partition (special char): "test+1@example.com" → Success

PARTITION CATEGORIES:
1. Valid format/range partition (representative value)
2. Invalid format partition (wrong format type)
3. Out of range partition (values outside allowed range)
4. Type error partition (wrong data type)
5. Null/Empty partition (missing input)
6. Special character partition (if applicable)

MINIMUM TEST CASES: Generate at least 5-7 test cases (one per partition).

OUTPUT FORMAT: Each test case must include partition_type (VALID/INVALID/EDGE) in notes.`,
  },

  DT: {
    description: "Decision Table Testing",
    instructions: `
DECISION TABLE TESTING (DT) - SPECIFIC INSTRUCTIONS:
====================================================

GOAL: Test combinations of conditions and their resulting actions.
Useful for complex logic with multiple conditions and rules.

KEY PRINCIPLES:
1. Identify ALL conditions from the requirement (if/when statements)
2. Identify possible values for each condition (True/False or multiple states)
3. Create test cases covering condition combinations that produce different outcomes
4. Include condition values in inputs
5. Include expected action/result in expectedOutput
6. Include "conditions_tested" in notes showing which conditions are being tested

EXAMPLE:
Requirement: "Approve loan if Age > 18 AND CreditScore > 700 AND Income > $30000"
Conditions:
  - C1: Age > 18 (T/F)
  - C2: CreditScore > 700 (T/F)
  - C3: Income > 30000 (T/F)

Decision Table (all meaningful combinations):
1. C1=T, C2=T, C3=T → Action: Approve
2. C1=T, C2=T, C3=F → Action: Reject (income too low)
3. C1=T, C2=F, C3=T → Action: Reject (credit score too low)
4. C1=F, C2=T, C3=T → Action: Reject (age too low)
5. C1=F, C2=F, C3=F → Action: Reject (all conditions fail)

Test Cases (one per row):
- TC_001: Age=25, CreditScore=750, Income=50000 → Approve (C1=T,C2=T,C3=T)
- TC_002: Age=25, CreditScore=750, Income=20000 → Reject (C1=T,C2=T,C3=F)
- TC_003: Age=25, CreditScore=650, Income=50000 → Reject (C1=T,C2=F,C3=T)
- TC_004: Age=16, CreditScore=750, Income=50000 → Reject (C1=F,C2=T,C3=T)
- TC_005: Age=16, CreditScore=650, Income=20000 → Reject (C1=F,C2=F,C3=F)

COVERAGE STRATEGY:
- Minimum: All outcomes (different actions) must be covered
- Standard: All condition combinations (2^n rows)
- Optimized: Minimal set covering all conditions × outcomes

MINIMUM TEST CASES: Generate at least 5-8 test cases covering all condition combinations.

OUTPUT FORMAT: Each test case must include conditions_tested in notes showing values for each condition.`,
  },
};

function buildPrompt({ mode, input, context = [], method }) {
  const contextLines = context.map((m) => `- ${m.role}: ${m.content}`).join("\n");
  const contextBlock = context.length
    ? `Context messages:\n${contextLines}`
    : "Context messages: none";

  const methodConfig = methodSpecificInstructions[method];
  const methodBlock = methodConfig
    ? `${methodConfig.instructions}`
    : `Method: ${method || "default"}\nApply best practices for the selected testing method.`;

  const jsonFormatBlock = mode === "blackbox-generate" ? `
RESPOND WITH ONLY VALID JSON - NO PREAMBLE, NO EXPLANATION, NO TEXT BEFORE OR AFTER:

{
  "testCases": [
    {
      "id": "TC_001",
      "description": "clear test case description in Indonesian that explains the scenario",
      "scenario": "what is being tested and why this test case is important",
      "inputs": { "field1": "boundary_or_partition_value", "field2": "condition_value" },
      "expectedOutput": "expected result, behavior, or action after this test case",
      "notes": "explanation for ${method} method - include boundary_type/partition_type/conditions_tested"
    }
  ]
}

CRITICAL REQUIREMENTS:
- Return ONLY JSON, nothing else
- NO preamble, explanation, or text outside JSON
- Generate minimum 6-8 test cases focused on ${method} methodology
- Each test case must clearly demonstrate the ${method} technique
- Include method-specific metadata in notes field
- Use realistic data based on the requirement
- Ensure all JSON is properly escaped
- Each test case description and notes should be in Indonesian
- Make test case names descriptive and meaningful` : "Output strictly as JSON with stable fields.";

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

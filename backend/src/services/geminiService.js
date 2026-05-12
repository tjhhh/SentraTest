const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

/**
 * Analyze functional requirement and generate BVA test cases using Gemini API
 * @param {string} requirementText 
 * @returns {Promise<Array>}
 */
async function analyzeBoundaryValues(requirementText) {
  const systemPrompt = `You are an expert QA engineer specializing in Boundary Value Analysis (BVA).
Analyze the following requirement and generate comprehensive BVA test cases.

REQUIREMENT:
${requirementText}

Generate test cases that cover:
1. Minimum boundary values (lower boundary)
2. Maximum boundary values (upper boundary)
3. Values just below minimum (invalid)
4. Values just above maximum (invalid)
5. Typical valid values within range (exact)

Return ONLY a valid JSON array (no other text, no markdown, no code blocks).

Example format:
[
  {
    "id": "tc-001",
    "name": "Minimum boundary value",
    "input": {"field": 18},
    "expectedOutput": "Valid - accepts minimum boundary",
    "boundaryType": "lower",
    "category": "boundary"
  }
]

Important:
- Generate 8-15 test cases
- Each test case MUST have all fields: id, name, input (object), expectedOutput, boundaryType, category
- boundaryType must be one of: lower, upper, exact, or invalid
- category must be one of: valid, boundary, or invalid
- Return ONLY JSON array, no markdown markers like \`\`\`json.`;

  let retries = 0;
  const maxRetries = 3;

  while (retries < maxRetries) {
    try {
      const result = await model.generateContent(systemPrompt);
      const responseText = await result.response.text();

      console.log("Gemini Raw Response:", responseText);

      // Clean response text in case Gemini adds markdown blocks
      const cleanedResponse = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      
      let testCases = JSON.parse(cleanedResponse);

      if (!Array.isArray(testCases)) {
        testCases = [testCases];
      }

      // Validate and format
      return testCases.map((tc, index) => ({
        id: tc.id || `tc-${String(index + 1).padStart(3, "0")}`,
        name: tc.name || `Test Case ${index + 1}`,
        input: tc.input || {},
        expectedOutput: tc.expectedOutput || "Success",
        boundaryType: tc.boundaryType || "exact",
        category: tc.category || "valid",
      }));

    } catch (error) {
      retries++;
      console.error(`Gemini API error (Attempt ${retries}/${maxRetries}):`, error.message);
      if (retries >= maxRetries) {
        throw new Error(`Failed to generate BVA after ${maxRetries} attempts: ${error.message}`);
      }
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
    }
  }
}

module.exports = {
  analyzeBoundaryValues,
};

const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY?.trim();
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured");
}

const genAI = new GoogleGenerativeAI(apiKey);
const modelCandidates = [
  process.env.GEMINI_MODEL,
  "gemini-2.5-flash",
  "gemini-flash-latest",
  "gemini-1.5",
].filter(Boolean);

function createModel(modelName) {
  return genAI.getGenerativeModel({
    model: modelName,
    temperature: 0.2,
  });
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

async function generateText(prompt) {
  let retries = 0;
  const maxRetries = 3;
  let currentModelIndex = 0;
  let model = createModel(modelCandidates[currentModelIndex]);

  while (retries < maxRetries) {
    try {
      const currentModelName = modelCandidates[currentModelIndex];
      console.log(`Using Gemini model: ${currentModelName}`);
      const result = await model.generateContent(prompt);
      const responseText = await result.response.text();
      return responseText;
    } catch (error) {
      retries++;
      const message = error?.message || String(error);
      console.error(`Gemini generation error (Attempt ${retries}/${maxRetries}) with model ${modelCandidates[currentModelIndex]}:`, message);

      const shouldTryNextModel = /not found|not supported|Too Many Requests|quota/i.test(message);
      if (shouldTryNextModel && currentModelIndex + 1 < modelCandidates.length) {
        currentModelIndex += 1;
        model = createModel(modelCandidates[currentModelIndex]);
        console.warn(`Switching Gemini model to ${modelCandidates[currentModelIndex]} and retrying.`);
        continue;
      }

      if (retries >= maxRetries) {
        throw new Error(`Gemini failed after ${maxRetries} attempts: ${message}`);
      }

      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, retries) * 1000));
    }
  }
}

module.exports = {
  generateText,
  sanitizeJsonString,
};

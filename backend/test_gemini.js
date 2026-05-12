const { generateText } = require("./src/services/ai/gemini.service");
const { appLogger } = require("./src/config/logger");

async function testGemini() {
  try {
    console.log("Testing Gemini with model:", require("./src/config/env").env.GEMINI_MODEL);
    const result = await generateText("Hello, are you there?");
    console.log("Result Provider:", result.provider);
    console.log("Result Text:", result.text);
  } catch (error) {
    console.error("Gemini Test Failed:", error.message);
  }
}

testGemini();

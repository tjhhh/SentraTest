const { env } = require("./backend/src/config/env");
console.log("GEMINI_API_KEY length:", env.GEMINI_API_KEY ? env.GEMINI_API_KEY.length : "undefined");
console.log("GEMINI_MODEL:", env.GEMINI_MODEL);

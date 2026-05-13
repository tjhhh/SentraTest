const path = require("path");
const dotenv = require("dotenv");
const { readSecret } = require("../utils/secrets");

/**
 * Loads environment variables from the .env file in the backend directory.
 * For production, also loads secrets from Docker secrets.
 * This ensures variables are loaded correctly even if the process is started from the project root.
 */
function loadEnv() {
  const envPath = path.resolve(__dirname, "../../.env");
  dotenv.config({ path: envPath });

  // For production, load secrets from Docker secrets
  if (process.env.NODE_ENV === "production") {
    try {
      // Override environment variables with secrets if available
      process.env.JWT_ACCESS_SECRET = readSecret("jwt_access_secret", "JWT_ACCESS_SECRET");
      process.env.JWT_REFRESH_SECRET = readSecret("jwt_refresh_secret", "JWT_REFRESH_SECRET");
      process.env.GEMINI_API_KEY = readSecret("gemini_api_key", "GEMINI_API_KEY");
    } catch (error) {
      console.error("Failed to load secrets:", error.message);
      // Continue with environment variables if secrets fail
    }
  }
}

loadEnv();

module.exports = { loadEnv };

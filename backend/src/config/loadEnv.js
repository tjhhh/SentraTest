const path = require("path");
const dotenv = require("dotenv");

/**
 * Loads environment variables from the .env file in the backend directory.
 * This ensures variables are loaded correctly even if the process is started from the project root.
 */
function loadEnv() {
  const envPath = path.resolve(__dirname, "../../.env");
  dotenv.config({ path: envPath });
}

loadEnv();

module.exports = { loadEnv };

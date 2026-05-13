const fs = require("fs");
const path = require("path");

/**
 * Reads a secret from Docker secrets file or falls back to environment variable
 * @param {string} secretName - Name of the secret (without _SECRET suffix)
 * @param {string} envVarName - Environment variable name to fallback to
 * @returns {string} The secret value
 */
function readSecret(secretName, envVarName) {
  const secretPath = `/run/secrets/${secretName}`;

  try {
    // Try to read from Docker secrets first
    if (fs.existsSync(secretPath)) {
      return fs.readFileSync(secretPath, "utf8").trim();
    }
  } catch (error) {
    console.warn(`Failed to read secret ${secretName} from ${secretPath}:`, error.message);
  }

  // Fallback to environment variable
  const envValue = process.env[envVarName];
  if (envValue) {
    return envValue;
  }

  throw new Error(`Secret ${secretName} not found in Docker secrets or environment variable ${envVarName}`);
}

module.exports = { readSecret };
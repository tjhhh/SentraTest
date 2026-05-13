/**
 * Gemini API Client — SDK initialization, model config, and API call wrapper
 * with retry logic.
 */
const { GoogleGenAI } = require('@google/genai');

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const API_KEY = process.env.GEMINI_API_KEY || '';
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const GENERATION_CONFIG = {
  temperature: 0.7,
  maxOutputTokens: 2048,
};

const RETRY_DELAYS = [1000, 2000, 4000];

// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------
let ai = null;
let initError = null;

function initialize() {
  if (!API_KEY) {
    initError = 'GEMINI_API_KEY environment variable is not set. AI features are disabled.';
    console.warn(`[AI Service] ${initError}`);
    return;
  }

  try {
    ai = new GoogleGenAI({
      apiKey: API_KEY,
    });

    console.log(`[AI Service] Gemini client initialized (model: ${MODEL_NAME})`);
  } catch (err) {
    initError = `Failed to initialize Gemini client: ${err.message}`;
    console.error(`[AI Service] ${initError}`);
  }
}

initialize();

// ---------------------------------------------------------------------------
// Transient error detection
// ---------------------------------------------------------------------------
const TRANSIENT_STATUS_CODES = [429, 500, 502, 503, 504];

function isTransientError(err) {
  const status = err.status || err.statusCode;

  if (status && TRANSIENT_STATUS_CODES.includes(status)) return true;
  if (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') return true;
  if (err.message && err.message.toLowerCase().includes('fetch failed')) return true;

  return false;
}

// ---------------------------------------------------------------------------
// Generate content with retry
// ---------------------------------------------------------------------------
async function generateContent(prompt) {
  if (initError) {
    throw new Error(initError);
  }

  if (!ai) {
    throw new Error('Gemini client is not initialized.');
  }

  let lastErr;

  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: GENERATION_CONFIG,
      });

      return response.text || '';
    } catch (err) {
      lastErr = err;

      if (!isTransientError(err) || attempt >= RETRY_DELAYS.length) {
        break;
      }

      const delay = RETRY_DELAYS[attempt];

      console.warn(
        `[AI Service] Gemini call attempt ${attempt + 1} failed (${err.message}), retrying in ${delay}ms...`
      );

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  const msg = lastErr?.message || 'Unknown Gemini API error';
  const error = new Error(
    `Gemini API call failed after ${RETRY_DELAYS.length + 1} attempts: ${msg}`
  );

  error.originalError = lastErr;
  error.status = lastErr?.status || lastErr?.statusCode;

  throw error;
}

// ---------------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------------
function getStatus() {
  if (initError) {
    return { available: false, error: initError };
  }

  return {
    available: true,
    model: MODEL_NAME,
  };
}

// ---------------------------------------------------------------------------
// Re-initialize
// ---------------------------------------------------------------------------
function reinitialize() {
  ai = null;
  initError = null;
  initialize();
}

module.exports = {
  generateContent,
  getStatus,
  reinitialize,
  _isTransientError: isTransientError,
};
/**
 * Prompt Templates — Optimized prompt builders for each AI generation type.
 *
 * Each function returns a complete prompt string ready for Gemini.
 * All prompts instruct the AI to return strict JSON output.
 */

// ---------------------------------------------------------------------------
// Common JSON output schema for test cases
// ---------------------------------------------------------------------------
const TEST_CASE_SCHEMA = `[
  {
    "id": "TC-MODULE-001",
    "title": "Test case title",
    "precondition": "Preconditions if any",
    "steps": ["Step 1", "Step 2", "Step 3"],
    "expectedResult": "Expected result description",
    "type": "Positive | Negative | Edge",
    "priority": "High | Medium | Low"
  }
]`;

// ---------------------------------------------------------------------------
// BVA — Boundary Value Analysis
// ---------------------------------------------------------------------------
/**
 * Build a prompt for Boundary Value Analysis test case generation.
 *
 * @param {object} params
 * @param {string} params.featureDescription - Description of the feature to test
 * @param {string} [params.inputFields] - Input fields and their types/ranges
 * @param {string} [params.constraints] - Business rules and constraints
 * @param {string} [params.moduleName] - Module name for test case ID prefix (default: 'GEN')
 * @returns {string} Complete prompt
 */
function buildBVAPrompt({ featureDescription, inputFields = '', constraints = '', moduleName = 'GEN' }) {
  return `Anda adalah QA expert yang berpengalaman. Generate test case menggunakan Boundary Value Analysis (BVA).

Fitur yang akan diuji:
${featureDescription}

Input fields:
${inputFields || 'Tentukan berdasarkan deskripsi fitur di atas.'}

Constraints:
${constraints || 'Tidak ada constraints khusus.'}

Instruksi:
1. Identifikasi semua boundary values dari setiap input field
2. Generate MINIMAL 10 test case yang mencakup:
   - Nilai tepat di batas bawah (min)
   - Nilai tepat di batas atas (max)
   - Nilai satu di bawah batas bawah (min - 1)
   - Nilai satu di atas batas atas (max + 1)
   - Nilai normal di tengah range
3. Gunakan ID format: TC-${moduleName}-[NOMOR] (contoh: TC-${moduleName}-001)
4. Setiap test case HARUS memiliki semua field yang diperlukan

Output format (JSON array ONLY, tanpa markdown, tanpa penjelasan tambahan):
${TEST_CASE_SCHEMA}

PENTING: Respond dengan JSON array SAJA. Jangan tambahkan text, markdown code fences, atau penjelasan apapun di luar JSON.`;
}

// ---------------------------------------------------------------------------
// ECP — Equivalence Class Partitioning
// ---------------------------------------------------------------------------
/**
 * Build a prompt for Equivalence Class Partitioning test case generation.
 *
 * @param {object} params
 * @param {string} params.featureDescription - Description of the feature to test
 * @param {string} [params.inputFields] - Input fields and their types/ranges
 * @param {string} [params.moduleName] - Module name for test case ID prefix (default: 'GEN')
 * @returns {string} Complete prompt
 */
function buildECPPrompt({ featureDescription, inputFields = '', moduleName = 'GEN' }) {
  return `Anda adalah QA expert yang berpengalaman. Generate test case menggunakan Equivalence Class Partitioning (ECP).

Fitur yang akan diuji:
${featureDescription}

Input fields:
${inputFields || 'Tentukan berdasarkan deskripsi fitur di atas.'}

Instruksi:
1. Identifikasi SEMUA equivalence classes untuk setiap input:
   - Valid equivalence classes (input yang seharusnya diterima)
   - Invalid equivalence classes (input yang seharusnya ditolak)
2. Generate MINIMAL 10 test case — satu representative test case per equivalence class
3. Gunakan ID format: TC-${moduleName}-[NOMOR] (contoh: TC-${moduleName}-001)
4. Untuk setiap test case, jelaskan class mana yang direpresentasikan

Output format (JSON array ONLY, tanpa markdown, tanpa penjelasan tambahan):
${TEST_CASE_SCHEMA}

PENTING: Respond dengan JSON array SAJA. Jangan tambahkan text, markdown code fences, atau penjelasan apapun di luar JSON.`;
}

// ---------------------------------------------------------------------------
// White-Box Analysis
// ---------------------------------------------------------------------------
/**
 * Build a prompt for white-box testing analysis of source code.
 *
 * @param {object} params
 * @param {string} params.sourceCode - The source code to analyze
 * @param {string} [params.language] - Programming language (auto-detected if omitted)
 * @param {string} [params.moduleName] - Module name for test case ID prefix (default: 'WB')
 * @returns {string} Complete prompt
 */
function buildWhiteBoxPrompt({ sourceCode, language = '', moduleName = 'WB' }) {
  return `Anda adalah software testing expert yang berpengalaman dalam white-box testing. Analisis source code berikut dan generate test case.

${language ? `Bahasa pemrograman: ${language}` : ''}

Source code:
\`\`\`
${sourceCode}
\`\`\`

Instruksi:
1. Analisis code untuk coverage:
   - Statement coverage: identifikasi semua statements yang perlu dieksekusi
   - Branch coverage: identifikasi semua decision points (if/else, switch, ternary)
   - Path coverage: identifikasi independent execution paths
2. Identifikasi edge conditions:
   - Null/undefined inputs
   - Empty arrays/strings
   - Boundary conditions dalam loops
   - Error handling paths
3. Generate test case untuk setiap path/branch yang ditemukan
4. Gunakan ID format: TC-${moduleName}-[NOMOR] (contoh: TC-${moduleName}-001)

Output format (JSON object ONLY, tanpa markdown, tanpa penjelasan tambahan):
{
  "coverageAnalysis": {
    "statements": ["List of key statements identified"],
    "branches": ["List of branches/decision points"],
    "paths": ["List of independent paths"]
  },
  "testCases": ${TEST_CASE_SCHEMA}
}

PENTING: Respond dengan JSON object SAJA. Jangan tambahkan text, markdown code fences, atau penjelasan apapun di luar JSON.`;
}

// ---------------------------------------------------------------------------
// Bug Explainer
// ---------------------------------------------------------------------------
/**
 * Build a prompt for explaining an error log in simple language.
 *
 * @param {object} params
 * @param {string} params.errorLog - The error log/stack trace to explain
 * @param {string} [params.language] - Response language (default: 'Bahasa Indonesia')
 * @returns {string} Complete prompt
 */
function buildBugExplainerPrompt({ errorLog, language = 'Bahasa Indonesia' }) {
  return `Anda adalah debugging assistant yang berpengalaman. Jelaskan error berikut dalam bahasa yang sederhana dan mudah dipahami.

Error Log:
\`\`\`
${errorLog}
\`\`\`

Berikan analisis dalam ${language} dengan format berikut.

Output format (JSON object ONLY, tanpa markdown, tanpa penjelasan tambahan selain objek JSON):
{
  "summary": "Ringkasan singkat dari masalah dan akar penyebab",
  "errorExplanation": "Penjelasan singkat apa error ini",
  "possibleCauses": ["Penyebab 1", "Penyebab 2", "..."],
  "debuggingSteps": ["Langkah 1", "Langkah 2", "..."],
  "codeFixExamples": [
    {
      "description": "Penjelasan perbaikan",
      "before": "Kode sebelum perbaikan",
      "after": "Kode setelah perbaikan"
    }
  ],
  "additionalNotes": "Catatan tambahan jika ada"
}

PENTING: Respond dengan JSON object SAJA. Jangan tambahkan text, markdown code fences, atau penjelasan apapun di luar JSON.`;
}

// ---------------------------------------------------------------------------
// Chatbot (general conversation)
// ---------------------------------------------------------------------------
/**
 * Build a prompt for the chatbot assistant with conversation context.
 *
 * @param {object} params
 * @param {string} params.userMessage - The current user message
 * @param {Array<{role: string, content: string}>} [params.history] - Previous messages
 * @returns {string} Complete prompt
 */
function buildChatPrompt({ userMessage, history = [] }) {
  let contextBlock = '';
  if (history.length > 0) {
    const formatted = history
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n\n');
    contextBlock = `Riwayat percakapan sebelumnya:\n${formatted}\n\n---\n\n`;
  }

  return `Anda adalah SentraTest AI Assistant — asisten QA dan testing yang membantu pengguna dengan pertanyaan seputar software testing, quality assurance, dan debugging.

${contextBlock}User: ${userMessage}

Berikan jawaban yang helpful, akurat, dan mudah dipahami.
Jika relevan, sertakan contoh kode atau langkah-langkah praktis.

Format jawaban:
1. Ringkasan singkat
2. Poin utama atau konsep penting
3. Langkah-langkah atau rekomendasi yang jelas
4. Catatan tambahan atau perhatian khusus

Gunakan Markdown untuk penataan dan struktur yang rapi.`;
}

module.exports = {
  buildBVAPrompt,
  buildECPPrompt,
  buildWhiteBoxPrompt,
  buildBugExplainerPrompt,
  buildChatPrompt,
  // Exported for testing
  TEST_CASE_SCHEMA,
};

/**
 * Response Validator — Parse AI responses into structured JSON,
 * validate required fields, and attempt programmatic fixes.
 */

const REQUIRED_FIELDS = ['id', 'title', 'steps', 'expectedResult'];
const ID_PATTERN = /^TC-[A-Z]+-\d+$/;

function extractJSON(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Empty or non-string response from AI');
  }
  const trimmed = text.trim();

  try { return JSON.parse(trimmed); } catch (_) { /* continue */ }

  const fenceMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  if (fenceMatch) {
    try { return JSON.parse(fenceMatch[1].trim()); } catch (_) { /* continue */ }
  }

  const jsonStart = trimmed.search(/[{\[]/);
  if (jsonStart !== -1) {
    const closeChar = trimmed[jsonStart] === '{' ? '}' : ']';
    const lastClose = trimmed.lastIndexOf(closeChar);
    if (lastClose > jsonStart) {
      try { return JSON.parse(trimmed.slice(jsonStart, lastClose + 1)); } catch (_) { /* continue */ }
    }
  }

  throw new Error('Could not extract valid JSON from AI response');
}

function validateTestCase(tc) {
  const errors = [];
  if (!tc || typeof tc !== 'object') return { valid: false, errors: ['Not an object'] };

  for (const f of REQUIRED_FIELDS) {
    if (tc[f] == null) errors.push(`Missing: ${f}`);
    else if (typeof tc[f] === 'string' && tc[f].trim() === '') errors.push(`Empty: ${f}`);
    else if (f === 'steps' && Array.isArray(tc[f]) && tc[f].length === 0) errors.push(`Empty: ${f}`);
  }
  if (tc.id && typeof tc.id === 'string' && !ID_PATTERN.test(tc.id)) {
    errors.push(`Invalid ID format: "${tc.id}"`);
  }
  return { valid: errors.length === 0, errors };
}

function validateTestCases(testCases) {
  if (!Array.isArray(testCases)) return { valid: [], invalid: [], warnings: ['Not an array'] };
  const valid = [], invalid = [], warnings = [];
  testCases.forEach((tc, i) => {
    const r = validateTestCase(tc);
    if (r.valid) valid.push(tc);
    else { invalid.push({ index: i, testCase: tc, errors: r.errors }); warnings.push(`TC ${i}: ${r.errors.join(', ')}`); }
  });
  return { valid, invalid, warnings };
}

function attemptFix(tc, index, moduleName = 'GEN') {
  const fixed = { ...tc };
  const changes = [];

  if (!fixed.id || !ID_PATTERN.test(fixed.id)) {
    fixed.id = `TC-${moduleName}-${String(index + 1).padStart(3, '0')}`;
    changes.push('Fixed ID');
  }
  if (!fixed.title || (typeof fixed.title === 'string' && !fixed.title.trim())) {
    fixed.title = `Test Case ${index + 1}`;
    changes.push('Added title');
  }
  if (!fixed.steps) { fixed.steps = ['(Not provided)']; changes.push('Added steps'); }
  else if (typeof fixed.steps === 'string') { fixed.steps = [fixed.steps]; changes.push('Converted steps'); }
  if (!fixed.expectedResult || (typeof fixed.expectedResult === 'string' && !fixed.expectedResult.trim())) {
    fixed.expectedResult = '(Not provided)';
    changes.push('Added expectedResult');
  }

  return { fixed, changes };
}

function processTestCaseResponse(responseText, options = {}) {
  const { moduleName = 'GEN', isWhiteBox = false } = options;
  const warnings = [];
  let parsed;
  try { parsed = extractJSON(responseText); } catch (err) {
    return { testCases: [], warnings: [`Parse failed: ${err.message}`] };
  }

  let testCasesRaw, coverageAnalysis;
  if (isWhiteBox && parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    coverageAnalysis = parsed.coverageAnalysis || null;
    testCasesRaw = parsed.testCases || [];
  } else if (Array.isArray(parsed)) {
    testCasesRaw = parsed;
  } else if (parsed && parsed.testCases) {
    testCasesRaw = parsed.testCases;
    coverageAnalysis = parsed.coverageAnalysis;
  } else {
    return { testCases: [], warnings: ['Unrecognized format'] };
  }

  const v = validateTestCases(testCasesRaw);
  const fixedValid = [];
  for (const item of v.invalid) {
    const { fixed, changes } = attemptFix(item.testCase, item.index, moduleName);
    const rv = validateTestCase(fixed);
    if (rv.valid) { fixedValid.push(fixed); warnings.push(`TC ${item.index} auto-fixed: ${changes.join('; ')}`); }
    else warnings.push(`TC ${item.index} could not be fixed`);
  }

  warnings.push(...v.warnings);
  const result = { testCases: [...v.valid, ...fixedValid], warnings };
  if (coverageAnalysis) result.coverageAnalysis = coverageAnalysis;
  return result;
}

function processBugExplainerResponse(responseText) {
  const warnings = [];
  let parsed;
  try { parsed = extractJSON(responseText); } catch (err) {
    return { result: null, warnings: [`Parse failed: ${err.message}`] };
  }
  if (!parsed || typeof parsed !== 'object') return { result: null, warnings: ['Invalid object'] };
  for (const f of ['errorExplanation', 'possibleCauses', 'debuggingSteps']) {
    if (!parsed[f]) warnings.push(`Missing: ${f}`);
  }
  return { result: parsed, warnings };
}

module.exports = {
  extractJSON, validateTestCase, validateTestCases, attemptFix,
  processTestCaseResponse, processBugExplainerResponse,
  REQUIRED_FIELDS, ID_PATTERN,
};

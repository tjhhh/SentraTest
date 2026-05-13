/**
 * Unit tests for response validator.
 */
const {
  extractJSON, validateTestCase, validateTestCases,
  attemptFix, processTestCaseResponse, processBugExplainerResponse,
} = require('../../src/ai/responseValidator');

describe('responseValidator', () => {
  describe('extractJSON', () => {
    it('should parse plain JSON', () => {
      expect(extractJSON('[{"id":"TC-GEN-001"}]')).toEqual([{ id: 'TC-GEN-001' }]);
    });

    it('should strip markdown code fences', () => {
      const text = '```json\n[{"id":"TC-GEN-001"}]\n```';
      expect(extractJSON(text)).toEqual([{ id: 'TC-GEN-001' }]);
    });

    it('should extract JSON from surrounding prose', () => {
      const text = 'Here are the test cases:\n[{"id":"TC-GEN-001"}]\nHope this helps!';
      expect(extractJSON(text)).toEqual([{ id: 'TC-GEN-001' }]);
    });

    it('should throw on empty input', () => {
      expect(() => extractJSON('')).toThrow();
    });

    it('should throw on non-JSON text', () => {
      expect(() => extractJSON('Hello world')).toThrow();
    });

    it('should handle JSON object (not array)', () => {
      expect(extractJSON('{"key":"value"}')).toEqual({ key: 'value' });
    });
  });

  describe('validateTestCase', () => {
    const validTC = {
      id: 'TC-AUTH-001', title: 'Login test',
      steps: ['Go to login', 'Enter creds'], expectedResult: 'User logged in',
    };

    it('should pass valid test case', () => {
      expect(validateTestCase(validTC).valid).toBe(true);
    });

    it('should fail on missing required field', () => {
      const { valid, errors } = validateTestCase({ id: 'TC-AUTH-001' });
      expect(valid).toBe(false);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail on empty title', () => {
      const { valid } = validateTestCase({ ...validTC, title: '' });
      expect(valid).toBe(false);
    });

    it('should fail on invalid ID format', () => {
      const { valid, errors } = validateTestCase({ ...validTC, id: 'invalid' });
      expect(valid).toBe(false);
      expect(errors.some(e => e.includes('Invalid ID'))).toBe(true);
    });

    it('should fail on empty steps array', () => {
      const { valid } = validateTestCase({ ...validTC, steps: [] });
      expect(valid).toBe(false);
    });

    it('should fail on null input', () => {
      expect(validateTestCase(null).valid).toBe(false);
    });
  });

  describe('validateTestCases', () => {
    it('should separate valid and invalid', () => {
      const cases = [
        { id: 'TC-GEN-001', title: 'T1', steps: ['s1'], expectedResult: 'r1' },
        { id: 'bad', title: '', steps: [], expectedResult: '' },
      ];
      const { valid, invalid } = validateTestCases(cases);
      expect(valid.length).toBe(1);
      expect(invalid.length).toBe(1);
    });

    it('should handle non-array input', () => {
      const { valid, warnings } = validateTestCases('not an array');
      expect(valid).toEqual([]);
      expect(warnings.length).toBeGreaterThan(0);
    });
  });

  describe('attemptFix', () => {
    it('should fix missing ID', () => {
      const { fixed, changes } = attemptFix({ title: 'Test' }, 0, 'MOD');
      expect(fixed.id).toBe('TC-MOD-001');
      expect(changes.length).toBeGreaterThan(0);
    });

    it('should fix invalid ID format', () => {
      const { fixed } = attemptFix({ id: 'bad-id', title: 'Test' }, 2, 'GEN');
      expect(fixed.id).toBe('TC-GEN-003');
    });

    it('should convert string steps to array', () => {
      const { fixed } = attemptFix({ steps: 'single step' }, 0);
      expect(Array.isArray(fixed.steps)).toBe(true);
    });

    it('should add placeholder for missing fields', () => {
      const { fixed } = attemptFix({}, 0);
      expect(fixed.title).toBeTruthy();
      expect(fixed.steps.length).toBeGreaterThan(0);
      expect(fixed.expectedResult).toBeTruthy();
    });
  });

  describe('processTestCaseResponse', () => {
    it('should process valid JSON array response', () => {
      const json = JSON.stringify([
        { id: 'TC-GEN-001', title: 'T', steps: ['s'], expectedResult: 'r' },
      ]);
      const { testCases, warnings } = processTestCaseResponse(json);
      expect(testCases.length).toBe(1);
    });

    it('should handle markdown-wrapped response', () => {
      const text = '```json\n[{"id":"TC-GEN-001","title":"T","steps":["s"],"expectedResult":"r"}]\n```';
      const { testCases } = processTestCaseResponse(text);
      expect(testCases.length).toBe(1);
    });

    it('should auto-fix invalid test cases', () => {
      const json = JSON.stringify([{ title: 'No ID test' }]);
      const { testCases, warnings } = processTestCaseResponse(json);
      expect(testCases.length).toBe(1);
      expect(testCases[0].id).toMatch(/^TC-GEN-/);
      expect(warnings.length).toBeGreaterThan(0);
    });

    it('should handle white-box response structure', () => {
      const json = JSON.stringify({
        coverageAnalysis: { statements: ['s1'] },
        testCases: [{ id: 'TC-WB-001', title: 'T', steps: ['s'], expectedResult: 'r' }],
      });
      const result = processTestCaseResponse(json, { isWhiteBox: true });
      expect(result.testCases.length).toBe(1);
      expect(result.coverageAnalysis).toBeDefined();
    });

    it('should return empty on unparseable input', () => {
      const { testCases, warnings } = processTestCaseResponse('not json at all!!!');
      expect(testCases).toEqual([]);
      expect(warnings.length).toBeGreaterThan(0);
    });
  });

  describe('processBugExplainerResponse', () => {
    it('should parse valid bug explanation', () => {
      const json = JSON.stringify({
        errorExplanation: 'A null pointer', possibleCauses: ['x'], debuggingSteps: ['y'],
      });
      const { result, warnings } = processBugExplainerResponse(json);
      expect(result.errorExplanation).toBe('A null pointer');
    });

    it('should warn on missing fields', () => {
      const { warnings } = processBugExplainerResponse('{}');
      expect(warnings.length).toBeGreaterThan(0);
    });

    it('should handle unparseable input', () => {
      const { result } = processBugExplainerResponse('bad');
      expect(result).toBeNull();
    });
  });
});

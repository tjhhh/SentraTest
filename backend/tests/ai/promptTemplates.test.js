/**
 * Unit tests for prompt templates.
 */
const {
  buildBVAPrompt, buildECPPrompt, buildWhiteBoxPrompt,
  buildBugExplainerPrompt, buildChatPrompt,
} = require('../../src/ai/promptTemplates');

describe('promptTemplates', () => {
  describe('buildBVAPrompt', () => {
    it('should include feature description', () => {
      const prompt = buildBVAPrompt({ featureDescription: 'User registration form' });
      expect(prompt).toContain('User registration form');
    });

    it('should include input fields when provided', () => {
      const prompt = buildBVAPrompt({
        featureDescription: 'Login',
        inputFields: 'email: string, password: string',
      });
      expect(prompt).toContain('email: string, password: string');
    });

    it('should include constraints when provided', () => {
      const prompt = buildBVAPrompt({
        featureDescription: 'Login',
        constraints: 'Password min 8 chars',
      });
      expect(prompt).toContain('Password min 8 chars');
    });

    it('should use custom module name in ID format', () => {
      const prompt = buildBVAPrompt({
        featureDescription: 'Login',
        moduleName: 'AUTH',
      });
      expect(prompt).toContain('TC-AUTH-');
    });

    it('should default module name to GEN', () => {
      const prompt = buildBVAPrompt({ featureDescription: 'Login' });
      expect(prompt).toContain('TC-GEN-');
    });

    it('should instruct JSON-only output', () => {
      const prompt = buildBVAPrompt({ featureDescription: 'Login' });
      expect(prompt).toContain('JSON array SAJA');
    });

    it('should request minimum 10 test cases', () => {
      const prompt = buildBVAPrompt({ featureDescription: 'Login' });
      expect(prompt).toContain('MINIMAL 10');
    });
  });

  describe('buildECPPrompt', () => {
    it('should include feature description', () => {
      const prompt = buildECPPrompt({ featureDescription: 'Email validation' });
      expect(prompt).toContain('Email validation');
    });

    it('should mention equivalence classes', () => {
      const prompt = buildECPPrompt({ featureDescription: 'Email validation' });
      expect(prompt).toContain('equivalence class');
    });

    it('should mention valid and invalid classes', () => {
      const prompt = buildECPPrompt({ featureDescription: 'Email validation' });
      expect(prompt.toLowerCase()).toContain('valid');
      expect(prompt.toLowerCase()).toContain('invalid');
    });
  });

  describe('buildWhiteBoxPrompt', () => {
    it('should include source code', () => {
      const prompt = buildWhiteBoxPrompt({ sourceCode: 'function add(a, b) { return a + b; }' });
      expect(prompt).toContain('function add(a, b)');
    });

    it('should include language when provided', () => {
      const prompt = buildWhiteBoxPrompt({
        sourceCode: 'def add(a, b): return a + b',
        language: 'Python',
      });
      expect(prompt).toContain('Python');
    });

    it('should mention coverage types', () => {
      const prompt = buildWhiteBoxPrompt({ sourceCode: 'x = 1' });
      expect(prompt).toContain('Statement coverage');
      expect(prompt).toContain('Branch coverage');
      expect(prompt).toContain('Path coverage');
    });
  });

  describe('buildBugExplainerPrompt', () => {
    it('should include the error log', () => {
      const prompt = buildBugExplainerPrompt({ errorLog: 'TypeError: x is not a function' });
      expect(prompt).toContain('TypeError: x is not a function');
    });

    it('should default to Bahasa Indonesia', () => {
      const prompt = buildBugExplainerPrompt({ errorLog: 'error' });
      expect(prompt).toContain('Bahasa Indonesia');
    });

    it('should use custom language when provided', () => {
      const prompt = buildBugExplainerPrompt({ errorLog: 'error', language: 'English' });
      expect(prompt).toContain('English');
    });
  });

  describe('buildChatPrompt', () => {
    it('should include user message', () => {
      const prompt = buildChatPrompt({ userMessage: 'What is BVA?' });
      expect(prompt).toContain('What is BVA?');
    });

    it('should include history when provided', () => {
      const prompt = buildChatPrompt({
        userMessage: 'Tell me more',
        history: [
          { role: 'user', content: 'Hello' },
          { role: 'assistant', content: 'Hi!' },
        ],
      });
      expect(prompt).toContain('User: Hello');
      expect(prompt).toContain('Assistant: Hi!');
    });

    it('should work with empty history', () => {
      const prompt = buildChatPrompt({ userMessage: 'Hello', history: [] });
      expect(prompt).toContain('Hello');
      expect(prompt).not.toContain('Riwayat percakapan');
    });
  });
});

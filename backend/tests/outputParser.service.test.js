const { parseJsonSafe, normalizeGenerationOutput } = require("../src/services/ai/outputParser.service");

describe("OutputParser Service", () => {
  describe("parseJsonSafe", () => {
    it("should parse valid JSON", () => {
      const result = parseJsonSafe('{"key": "value"}');
      expect(result.ok).toBe(true);
      expect(result.data).toEqual({ key: "value" });
    });

    it("should handle invalid JSON", () => {
      const result = parseJsonSafe("invalid json");
      expect(result.ok).toBe(false);
      expect(result.data.raw).toBe("invalid json");
      expect(result.data.parseError).toBeDefined();
    });
  });

  describe("normalizeGenerationOutput", () => {
    it("should return normalized data for ok result", () => {
      const parsed = { ok: true, data: { test: 1 } };
      const output = normalizeGenerationOutput("chat", parsed);
      expect(output.mode).toBe("chat");
      expect(output.content).toEqual({ test: 1 });
    });

    it("should return raw content for failed parse", () => {
      const parsed = { ok: false, data: { raw: "raw text" } };
      const output = normalizeGenerationOutput("chat", parsed);
      expect(output.content.raw).toBe("raw text");
      expect(output.content.note).toBeDefined();
    });
  });
});

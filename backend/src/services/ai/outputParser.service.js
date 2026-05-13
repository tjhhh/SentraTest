function parseJsonSafe(text) {
  try {
    return { ok: true, data: JSON.parse(text) };
  } catch (error) {
    // Try to extract JSON from text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const extracted = JSON.parse(jsonMatch[0]);
        return { ok: true, data: extracted };
      } catch (e) {
        // If extraction fails, return raw text
      }
    }

    return {
      ok: false,
      data: {
        raw: text,
        parseError: error instanceof Error ? error.message : "Unknown parse error",
      },
    };
  }
}

function normalizeGenerationOutput(mode, parsed) {
  if (parsed.ok) {
    return { mode, content: parsed.data };
  }

  // Try to extract testCases from raw text for blackbox mode
  if (mode === "blackbox" && parsed.data.raw) {
    const raw = parsed.data.raw;
    try {
      // Look for testCases pattern in raw text
      const testCasesMatch = raw.match(/"testCases"\s*:\s*\[([\s\S]*?)\](?:\s*[,}]|$)/);
      if (testCasesMatch) {
        const testCasesStr = "[" + testCasesMatch[1] + "]";
        const testCases = JSON.parse(testCasesStr);
        return { mode, content: { testCases } };
      }
    } catch (e) {
      // Continue to fallback
    }
  }

  return {
    mode,
    content: {
      raw: parsed.data.raw,
      note: "Could not parse response as JSON. Showing raw response.",
    },
  };
}

module.exports = { parseJsonSafe, normalizeGenerationOutput };

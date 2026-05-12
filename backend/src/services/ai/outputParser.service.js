function parseJsonSafe(text) {
  try {
    return { ok: true, data: JSON.parse(text) };
  } catch (error) {
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

  return {
    mode,
    content: {
      raw: parsed.data.raw,
      note: "Response was not valid JSON; returned as raw text.",
    },
  };
}

module.exports = { parseJsonSafe, normalizeGenerationOutput };

const express = require("express");
const router = express.Router();
const { generateDecisionTable } = require("../services/decisionTableService");
const { saveDecisionTable } = require("../services/dbService");

function getDbErrorMessage(error) {
  if (!error || !error.message) return null;
  const message = error.message.toLowerCase();
  if (message.includes("connect") || message.includes("econnrefused") || message.includes("database")) {
    return "Koneksi Database Gagal";
  }
  return null;
}

/**
 * POST /api/decision-table/generate
 * Generate Decision Table from requirement text
 */
router.post("/generate", async (req, res) => {
  try {
    const { requirement, requirementText } = req.body;
    const finalRequirement = requirementText || requirement;

    if (!finalRequirement || finalRequirement.length < 50 || finalRequirement.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Requirement must be between 50 and 2000 characters",
      });
    }

    const data = await generateDecisionTable(finalRequirement);
    await saveDecisionTable(null, finalRequirement, data);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Decision Table Generation Error:", error);
    const dbMessage = getDbErrorMessage(error);
    res.status(500).json({
      success: false,
      message: dbMessage || "Failed to generate Decision Table",
      error: error.message,
    });
  }
});

/**
 * POST /api/dt
 * Generate Decision Table from requirement text (Supporting base route)
 */
router.post("/", async (req, res) => {
  try {
    const { requirement, requirementText } = req.body;
    const finalRequirement = requirementText || requirement;

    if (!finalRequirement || finalRequirement.length < 50 || finalRequirement.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Requirement must be between 50 and 2000 characters",
      });
    }

    const data = await generateDecisionTable(finalRequirement);
    await saveDecisionTable(null, finalRequirement, data);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Decision Table Generation Error:", error);
    const dbMessage = getDbErrorMessage(error);
    res.status(500).json({
      success: false,
      message: dbMessage || "Failed to generate Decision Table",
      error: error.message,
    });
  }
});

module.exports = router;

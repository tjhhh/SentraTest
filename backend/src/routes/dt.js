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
 * POST /api/dt
 * Generate Decision Table from requirement text
 */
router.post("/", async (req, res) => {
  try {
    const { requirement } = req.body;

    if (!requirement || requirement.length < 50 || requirement.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Requirement must be between 50 and 2000 characters",
      });
    }

    const data = await generateDecisionTable(requirement);
    await saveDecisionTable(null, requirement, data);

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

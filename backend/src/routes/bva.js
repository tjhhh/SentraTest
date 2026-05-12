const express = require("express");
const router = express.Router();
const { analyzeBoundaryValues } = require("../services/bvaService");
const { saveBVATestCases } = require("../services/dbService");

function getDbErrorMessage(error) {
  if (!error || !error.message) return null;
  const message = error.message.toLowerCase();
  if (message.includes("connect") || message.includes("econnrefused") || message.includes("database")) {
    return "Koneksi Database Gagal";
  }
  return null;
}

/**
 * POST /api/bva/generate
 * Main endpoint for generation
 */
router.post("/generate", async (req, res) => {
  try {
    const { requirement } = req.body;

    if (!requirement || requirement.length < 50 || requirement.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Requirement must be between 50 and 2000 characters",
      });
    }

    const testCases = await analyzeBoundaryValues(requirement);
    await saveBVATestCases(null, requirement, testCases);

    res.json({
      success: true,
      data: testCases,
    });
  } catch (error) {
    console.error("BVA Generation Error:", error);
    const dbMessage = getDbErrorMessage(error);
    res.status(500).json({
      success: false,
      message: dbMessage || "Failed to generate BVA test cases",
      error: error.message,
    });
  }
});

/**
 * POST /api/bva
 * Supporting base POST route for consistency
 */
router.post("/", async (req, res) => {
    try {
      const { requirement } = req.body;
      if (!requirement || requirement.length < 50) {
        return res.status(400).json({ success: false, message: "Requirement (min 50 chars) is required" });
      }
      const testCases = await analyzeBoundaryValues(requirement);
      await saveBVATestCases(null, requirement, testCases);
      res.json({ success: true, data: testCases });
    } catch (error) {
      console.error("BVA Error:", error);
      const dbMessage = getDbErrorMessage(error);
      res.status(500).json({ success: false, message: dbMessage || "Error", error: error.message });
    }
});

module.exports = router;

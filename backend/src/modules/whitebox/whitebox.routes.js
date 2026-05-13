const express = require("express");

const { authMiddleware } = require("../../middlewares/authMiddleware");
const { validate } = require("../../middlewares/validate");
const { generationLimiter } = require("../../middlewares/rateLimiters");
const { analyze, script, generate, run } = require("./whitebox.controller");
const { analyzeSchema, scriptSchema } = require("./whitebox.schema");

const router = express.Router();

// Protected endpoints (require auth)
router.post("/generate", authMiddleware, generationLimiter, generate);
router.post("/run", authMiddleware, generationLimiter, run);
router.post("/analyze", authMiddleware, generationLimiter, validate(analyzeSchema), analyze);
router.post("/script", authMiddleware, generationLimiter, validate(scriptSchema), script);

/**
 * @openapi
 * /api/wb/analyze:
 *   post:
 *     tags: [Whitebox]
 *     summary: Analisis source code untuk coverage whitebox
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [conversationId, coverageType, sourceCode]
 *             properties:
 *               conversationId: { type: string }
 *               coverageType: { type: string, enum: [STATEMENT, BRANCH, PATH] }
 *               sourceCode: { type: string }
 *     responses:
 *       200:
 *         description: Analisis berhasil dilakukan
 */

/**
 * @openapi
 * /api/wb/script:
 *   post:
 *     tags: [Whitebox]
 *     summary: Generate Playwright script dari analisis whitebox
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [analysis]
 *             properties:
 *               analysis: { type: object }
 *     responses:
 *       200:
 *         description: Script berhasil digenerate
 */
router.post("/script", authMiddleware, generationLimiter, validate(scriptSchema), script);

module.exports = { whiteboxRoutes: router };

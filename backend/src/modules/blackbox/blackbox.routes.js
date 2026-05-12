const express = require("express");

const { authMiddleware } = require("../../middlewares/authMiddleware");
const { validate } = require("../../middlewares/validate");
const { generationLimiter } = require("../../middlewares/rateLimiters");
const { generate, history, script, exportResult } = require("./blackbox.controller");
const { generateSchema, scriptSchema, exportSchema } = require("./blackbox.schema");

const router = express.Router();

router.use(authMiddleware);

/**
 * @openapi
 * /api/bb/history/{conversationId}:
 *   get:
 *     tags: [Blackbox]
 *     summary: Ambil test case blackbox terakhir dalam percakapan
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil mengambil history
 *       404:
 *         description: History tidak ditemukan
 */
router.get("/history/:conversationId", history);

/**
 * @openapi
 * /api/bb/generate:
 *   post:
 *     tags: [Blackbox]
 *     summary: Generate testcase blackbox
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [conversationId, method, requirement]
 *             properties:
 *               conversationId: { type: string }
 *               method: { type: string, enum: [BVA, EQP, DT] }
 *               requirement: { type: string }
 *     responses:
 *       201:
 *         description: Testcase berhasil digenerate
 */
router.post("/generate", generationLimiter, validate(generateSchema), generate);

/**
 * @openapi
 * /api/bb/script:
 *   post:
 *     tags: [Blackbox]
 *     summary: Generate Playwright script dari testcase blackbox
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [testCaseId]
 *             properties:
 *               testCaseId: { type: string }
 *     responses:
 *       200:
 *         description: Script berhasil digenerate
 */
router.post("/script", generationLimiter, validate(scriptSchema), script);

/**
 * @openapi
 * /api/bb/export:
 *   post:
 *     tags: [Blackbox]
 *     summary: Export hasil testcase blackbox
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [format, payload]
 *             properties:
 *               format: { type: string, enum: [PDF, DOCX, JSON, ZIP] }
 *               payload: { type: object }
 *     responses:
 *       200:
 *         description: File export berhasil dibuat
 */
router.post("/export", generationLimiter, validate(exportSchema), exportResult);

module.exports = { blackboxRoutes: router };

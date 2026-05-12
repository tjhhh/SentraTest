const express = require("express");

const { authMiddleware } = require("../../middlewares/authMiddleware");
const { validate } = require("../../middlewares/validate");
const { bugExplainSchema } = require("./bug.schema");
const { explain } = require("./bug.controller");

const router = express.Router();

router.use(authMiddleware);

/**
 * @openapi
 * /api/bug/explain:
 *   post:
 *     tags: [Bug]
 *     summary: Analisis stack trace dan berikan saran perbaikan
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [stackTrace]
 *             properties:
 *               stackTrace: { type: string }
 *               context: { type: string }
 *     responses:
 *       200:
 *         description: Analisis bug berhasil dilakukan
 */
router.post("/explain", validate(bugExplainSchema), explain);

module.exports = { bugRoutes: router };

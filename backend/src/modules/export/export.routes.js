const express = require("express");

const { authMiddleware } = require("../../middlewares/authMiddleware");
const { validate } = require("../../middlewares/validate");
const { exportPayloadSchema } = require("./export.schema");
const { exportAny } = require("./export.controller");

const router = express.Router();

router.use(authMiddleware);

/**
 * @openapi
 * /api/export/pdf:
 *   post:
 *     tags: [Export]
 *     summary: Export data ke format PDF
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExportPayload'
 *     responses:
 *       200:
 *         description: Berhasil export ke PDF
 */
router.post("/pdf", validate(exportPayloadSchema), exportAny);

/**
 * @openapi
 * /api/export/zip:
 *   post:
 *     tags: [Export]
 *     summary: Export data ke format ZIP
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExportPayload'
 *     responses:
 *       200:
 *         description: Berhasil export ke ZIP
 */
router.post("/zip", validate(exportPayloadSchema), exportAny);

/**
 * @openapi
 * /api/export/docx:
 *   post:
 *     tags: [Export]
 *     summary: Export data ke format DOCX
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExportPayload'
 *     responses:
 *       200:
 *         description: Berhasil export ke DOCX
 */
router.post("/docx", validate(exportPayloadSchema), exportAny);

/**
 * @openapi
 * /api/export/json:
 *   post:
 *     tags: [Export]
 *     summary: Export data ke format JSON
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExportPayload'
 *     responses:
 *       200:
 *         description: Berhasil export ke JSON
 */
router.post("/json", validate(exportPayloadSchema), exportAny);

/**
 * @openapi
 * components:
 *   schemas:
 *     ExportPayload:
 *       type: object
 *       required: [format, payload]
 *       properties:
 *         format: { type: string }
 *         fileName: { type: string }
 *         payload: { type: object }
 */

module.exports = { exportRoutes: router };

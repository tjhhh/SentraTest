const express = require("express");

const { authMiddleware } = require("../../middlewares/authMiddleware");
const { validate } = require("../../middlewares/validate");
const { chatLimiter } = require("../../middlewares/rateLimiters");
const { chatSchema } = require("./chat.schema");
const { postChat, getHistory, subscribe } = require("./chat.controller");

const router = express.Router();

router.use(authMiddleware);

/**
 * @openapi
 * /api/chat:
 *   post:
 *     tags: [Chat]
 *     summary: Kirim pesan chat ke asisten AI
 *     description: Mendukung mode sinkron (default) atau streaming (SSE) jika properti stream diset true.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [conversationId, message]
 *             properties:
 *               conversationId: { type: string }
 *               message: { type: string }
 *               stream: { type: boolean, default: false }
 *     responses:
 *       200:
 *         description: Respons AI (sinkron) atau inisialisasi stream (SSE)
 */
router.post("/", chatLimiter, validate(chatSchema), postChat);

/**
 * @openapi
 * /api/chat/history:
 *   get:
 *     tags: [Chat]
 *     summary: Ambil histori chat pengguna
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Histori chat berhasil diambil
 */
router.get("/history", getHistory);

/**
 * @openapi
 * /api/chat/stream/{conversationId}:
 *   get:
 *     tags: [Chat]
 *     summary: Berlangganan SSE stream untuk conversation tertentu
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Koneksi SSE berhasil dibuka
 */
router.get("/stream/:conversationId", subscribe);

module.exports = { chatRoutes: router };

const express = require("express");

const { authMiddleware } = require("../../middlewares/authMiddleware");
const { getMessages } = require("../conversation/conversation.controller");

const router = express.Router();

router.use(authMiddleware);

/**
 * @openapi
 * /api/messages/{conversationId}:
 *   get:
 *     tags: [Message]
 *     summary: Ambil histori pesan berdasarkan ID conversation
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Histori pesan berhasil diambil
 */
router.get("/:conversationId", getMessages);

module.exports = { messageRoutes: router };

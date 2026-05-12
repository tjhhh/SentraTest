const express = require("express");

const { authMiddleware } = require("../../middlewares/authMiddleware");
const { validate } = require("../../middlewares/validate");
const controller = require("./conversation.controller");
const { createConversationSchema, renameConversationSchema } = require("./conversation.schema");

const router = express.Router();

router.use(authMiddleware);

/**
 * @openapi
 * /api/conversations:
 *   get:
 *     tags: [Conversation]
 *     summary: Ambil daftar conversation milik pengguna
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Daftar conversation berhasil diambil
 */
router.get("/", controller.list);

/**
 * @openapi
 * /api/conversations:
 *   post:
 *     tags: [Conversation]
 *     summary: Buat conversation baru
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string }
 *     responses:
 *       201:
 *         description: Conversation berhasil dibuat
 */
router.post("/", validate(createConversationSchema), controller.create);

/**
 * @openapi
 * /api/conversations/{id}:
 *   patch:
 *     tags: [Conversation]
 *     summary: Ganti nama conversation
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string }
 *     responses:
 *       200:
 *         description: Nama conversation berhasil diubah
 */
router.patch("/:id", validate(renameConversationSchema), controller.rename);

/**
 * @openapi
 * /api/conversations/{id}:
 *   delete:
 *     tags: [Conversation]
 *     summary: Hapus conversation
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Conversation berhasil dihapus
 */
router.delete("/:id", controller.remove);

/**
 * @openapi
 * /api/conversations/{conversationId}:
 *   get:
 *     tags: [Conversation]
 *     summary: Ambil daftar pesan dalam conversation
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Daftar pesan berhasil diambil
 */
router.get("/:conversationId", controller.getMessages);

module.exports = { conversationRoutes: router };

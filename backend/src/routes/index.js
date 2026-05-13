const express = require("express");

const { authRoutes } = require("../modules/auth/auth.routes");
const { conversationRoutes } = require("../modules/conversation/conversation.routes");
const { messageRoutes } = require("../modules/message/message.routes");
const { chatRoutes } = require("../modules/chat/chat.routes");
const { blackboxRoutes } = require("../modules/blackbox/blackbox.routes");
const { whiteboxRoutes } = require("../modules/whitebox/whitebox.routes");
const { bugRoutes } = require("../modules/bug/bug.routes");
const { exportRoutes } = require("../modules/export/export.routes");
const chatsRouter = require("./chats");

const router = express.Router();

router.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

router.use("/auth", authRoutes);
router.use("/conversations", conversationRoutes);
router.use("/messages", messageRoutes);
router.use("/chat", chatRoutes);
router.use("/bb", blackboxRoutes);
router.use("/wb", whiteboxRoutes);
router.use("/whitebox", whiteboxRoutes);
router.use("/bug", bugRoutes);
router.use("/export", exportRoutes);
router.use("/chats", chatsRouter);

module.exports = { apiRouter: router };

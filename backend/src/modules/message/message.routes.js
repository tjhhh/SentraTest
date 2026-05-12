const express = require("express");

const { authMiddleware } = require("../../middlewares/authMiddleware");
const { getMessages } = require("../conversation/conversation.controller");

const router = express.Router();

router.use(authMiddleware);
router.get("/:conversationId", getMessages);

module.exports = { messageRoutes: router };

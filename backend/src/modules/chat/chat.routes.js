const express = require("express");

const { authMiddleware } = require("../../middlewares/authMiddleware");
const { validate } = require("../../middlewares/validate");
const { chatLimiter } = require("../../middlewares/rateLimiters");
const { chatSchema } = require("./chat.schema");
const { postChat, getHistory, subscribe } = require("./chat.controller");

const router = express.Router();

router.use(authMiddleware);
router.post("/", chatLimiter, validate(chatSchema), postChat);
router.get("/history", getHistory);
router.get("/stream/:conversationId", subscribe);

module.exports = { chatRoutes: router };

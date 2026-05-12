const express = require("express");

const { authMiddleware } = require("../../middlewares/authMiddleware");
const { validate } = require("../../middlewares/validate");
const controller = require("./conversation.controller");
const { createConversationSchema, renameConversationSchema } = require("./conversation.schema");

const router = express.Router();

router.use(authMiddleware);

router.get("/", controller.list);
router.post("/", validate(createConversationSchema), controller.create);
router.patch("/:id", validate(renameConversationSchema), controller.rename);
router.delete("/:id", controller.remove);

router.get("/:conversationId", controller.getMessages);

module.exports = { conversationRoutes: router };

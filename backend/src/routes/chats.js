const { Router } = require('express');
const { body, param, query, validationResult } = require('express-validator');
const db = require('../data/repository');
const aiService = require('../ai');

const router = Router();

const WELCOME_MESSAGE =
  'Halo! 👋 Saya adalah SentraTest AI Assistant. Saya bisa membantu Anda dengan:\n\n' +
  '• Pertanyaan seputar software testing & QA\n' +
  '• Penjelasan metodologi testing (BVA, ECP, dll)\n' +
  '• Analisis dan penjelasan error/bug\n' +
  '• Tips debugging dan best practices\n\n' +
  'Silakan tanyakan apa saja!';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// POST /chats  – create chat with welcome message
router.post(
  '/',
  [
    body('userId').isUUID().withMessage('Valid userId UUID required'),
    body('title').optional().isString(),
    body('initialMessage').optional().isString(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { userId, title = 'New Chat', initialMessage } = req.body;
      let chatId;

      if (initialMessage) {
        chatId = await db.createChatWithMessage(userId, title, initialMessage);
      } else {
        chatId = await db.createChat(userId, title);
      }

      // Add welcome message from assistant
      await db.addMessage(chatId, userId, 'assistant', WELCOME_MESSAGE);

      res.status(201).json({ id: chatId, welcomeMessage: WELCOME_MESSAGE });
    } catch (err) {
      next(err);
    }
  }
);

// GET /chats?userId=&limit=&offset=
router.get(
  '/',
  [
    query('userId').isUUID().withMessage('Valid userId UUID required'),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 }),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { userId, limit = 20, offset = 0 } = req.query;
      const chats = await db.listChatsByUser(userId, Number(limit), Number(offset));
      res.json({ data: chats, limit: Number(limit), offset: Number(offset) });
    } catch (err) {
      next(err);
    }
  }
);

// GET /chats/search?userId=&q=&limit=&offset=
router.get(
  '/search',
  [
    query('userId').isUUID().withMessage('Valid userId UUID required'),
    query('q').notEmpty().withMessage('Search query (q) is required'),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 }),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { userId, q, limit = 20, offset = 0 } = req.query;
      const results = await db.searchChatMessages(userId, q, Number(limit), Number(offset));
      res.json({ data: results, total: results.length, limit: Number(limit), offset: Number(offset) });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /chats/:id  – rename chat session
router.patch(
  '/:id',
  [
    param('id').isUUID(),
    body('title').notEmpty().withMessage('Title is required'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const updated = await db.updateChatTitle(req.params.id, req.body.title);
      if (!updated) {
        return res.status(404).json({ error: 'Chat not found' });
      }
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /chats/:id
router.delete(
  '/:id',
  [param('id').isUUID()],
  validate,
  async (req, res, next) => {
    try {
      await db.deleteChatById(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);

// POST /chats/:chatId/messages  – send message (auto AI reply)
router.post(
  '/:chatId/messages',
  [
    param('chatId').isUUID(),
    body('userId').isUUID(),
    body('content').notEmpty().withMessage('Message content is required'),
    body('role').optional().isIn(['user', 'assistant']),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { userId, content, role } = req.body;
      const chatId = req.params.chatId;

      // If role is explicitly 'assistant', just store the message (no AI call)
      if (role === 'assistant') {
        const msgId = await db.addMessage(chatId, userId, 'assistant', content);
        return res.status(201).json({ id: msgId });
      }

      // For user messages, call AI service for auto-reply
      try {
        const { reply, queuePosition, queueLength } = await aiService.chat(chatId, userId, content);
        res.status(201).json({
          userMessageId: 'saved',
          assistantReply: reply,
          queuePosition,
          queueLength,
        });
      } catch (aiErr) {
        // AI failed — still save the user message manually, return error for AI part
        const msgId = await db.addMessage(chatId, userId, 'user', content);
        res.status(201).json({
          id: msgId,
          assistantReply: null,
          aiError: aiErr.message || 'AI service unavailable',
        });
      }
    } catch (err) {
      next(err);
    }
  }
);

// POST /chats/:chatId/explain-bug  – bug explainer
router.post(
  '/:chatId/explain-bug',
  [
    param('chatId').isUUID(),
    body('userId').isUUID(),
    body('errorLog').notEmpty().withMessage('Error log is required'),
    body('language').optional().isString(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { userId, errorLog, language } = req.body;
      const chatId = req.params.chatId;

      // Save the error log as a user message
      await db.addMessage(chatId, userId, 'user', `[Bug Explainer]\n${errorLog}`);

      // Call AI service
      try {
        const { result, queuePosition, queueLength } = await aiService.explainBug(errorLog, { language });

        // Save AI explanation as assistant message
        const explanation = result.result || result;
        const replyText = typeof explanation === 'object'
          ? JSON.stringify(explanation, null, 2)
          : String(explanation);

        await db.addMessage(chatId, userId, 'assistant', replyText);

        res.status(201).json({
          explanation,
          warnings: result.warnings || [],
          queuePosition,
          queueLength,
        });
      } catch (aiErr) {
        res.status(503).json({
          error: 'AI service unavailable',
          message: aiErr.message,
        });
      }
    } catch (err) {
      next(err);
    }
  }
);

// GET /chats/:chatId/messages?limit=&offset=
router.get(
  '/:chatId/messages',
  [
    param('chatId').isUUID(),
    query('limit').optional().isInt({ min: 1, max: 200 }),
    query('offset').optional().isInt({ min: 0 }),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { limit = 100, offset = 0 } = req.query;
      const messages = await db.listMessagesByChat(req.params.chatId, Number(limit), Number(offset));
      res.json({ data: messages, limit: Number(limit), offset: Number(offset) });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;

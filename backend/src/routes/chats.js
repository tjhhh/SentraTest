const { Router } = require('express');
const { body, param, query, validationResult } = require('express-validator');
const db = require('../data/repository');
const aiService = require('../ai');
const { authMiddleware } = require('../middlewares/authMiddleware');

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
  authMiddleware,
  [
    body('title').optional().isString(),
    body('initialMessage').optional().isString(),
    body('context').optional().custom((value) => typeof value === 'object' && value !== null && !Array.isArray(value)).withMessage('Context must be an object'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { title = 'New Chat', initialMessage, context } = req.body;
      let chatId;

      if (initialMessage) {
        chatId = await db.createChatWithMessage(userId, title, initialMessage, context);
      } else {
        chatId = await db.createChat(userId, title, context);
      }

      // Add welcome message from assistant
      await db.addMessage(chatId, userId, 'assistant', WELCOME_MESSAGE);

      res.status(201).json({ data: { id: chatId, welcomeMessage: WELCOME_MESSAGE } });
    } catch (err) {
      next(err);
    }
  }
);

// GET /chats?userId=&limit=&offset=
router.get(
  '/',
  authMiddleware,
  [
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 }),
  ],
  validate,
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { limit = 20, offset = 0 } = req.query;
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
  authMiddleware,
  [
    query('q').notEmpty().withMessage('Search query (q) is required'),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 }),
  ],
  validate,
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { q, limit = 20, offset = 0 } = req.query;
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
  authMiddleware,
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
  authMiddleware,
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

// GET /chats/:chatId/messages  – get message history
router.get(
  '/:chatId/messages',
  authMiddleware,
  [
    param('chatId').isUUID(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 }),
  ],
  validate,
  async (req, res, next) => {
    try {
      const chatId = req.params.chatId;
      const { limit = 100, offset = 0 } = req.query;
      const messages = await db.listMessagesByChat(chatId, Number(limit), Number(offset));
      res.json({ data: messages, limit: Number(limit), offset: Number(offset) });
    } catch (err) {
      next(err);
    }
  }
);

// POST /chats/:chatId/messages  – send message (auto AI reply)
router.post(
  '/:chatId/messages',
  authMiddleware,
  [
    param('chatId').isUUID(),
    body('content').notEmpty().withMessage('Message content is required'),
    body('role').optional().isIn(['user', 'assistant']),
    body('context').optional().custom((value) => typeof value === 'object' && value !== null && !Array.isArray(value)).withMessage('Context must be an object'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { content, role, context } = req.body;
      const chatId = req.params.chatId;

      if (context) {
        await db.updateChatContext(chatId, context);
      }

      // If role is explicitly 'assistant', just store the message (no AI call)
      if (role === 'assistant') {
        const msgId = await db.addMessage(chatId, userId, 'assistant', content);
        return res.status(201).json({ id: msgId });
      }

      // For user messages, call AI service for auto-reply
      try {
        const { reply, queuePosition, queueLength } = await aiService.chat(chatId, userId, content);
        
        // Auto-generate title if it's still 'New Chat'
        try {
          const chat = await db.getChatById(chatId);
          if (chat && chat.title === 'New Chat') {
            const titlePrompt = `Generate a short title (max 5 words) for a conversation that starts with this message: "${content}". Return ONLY the title text, no quotes or punctuation.`;
            const generatedTitle = await aiService.generateText(titlePrompt);
            if (generatedTitle) {
              await db.updateChatTitle(chatId, generatedTitle.trim());
            }
          }
        } catch (titleErr) {
          console.error("Failed to auto-generate title", titleErr);
          // Don't fail the request if title generation fails
        }

        res.status(201).json({
          data: {
            userMessageId: 'saved',
            assistantReply: reply,
            queuePosition,
            queueLength,
          }
        });
      } catch (aiErr) {
        // AI failed — still save the user message manually, return error for AI part
        const msgId = await db.addMessage(chatId, userId, 'user', content);
        res.status(201).json({
          data: {
            id: msgId,
            assistantReply: null,
            aiError: aiErr.message || 'AI service unavailable',
          }
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
  authMiddleware,
  [
    param('chatId').isUUID(),
    body('errorLog').notEmpty().withMessage('Error log is required'),
    body('language').optional().isString(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { errorLog, language } = req.body;
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

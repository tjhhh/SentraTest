const request = require('supertest');
const app = require('../../src/index');
const db = require('../../src/data/repository');
const aiService = require('../../src/ai');

// Mock AI service to avoid real API calls during tests
jest.mock('../../src/ai', () => ({
  chat: jest.fn(),
  explainBug: jest.fn(),
}));

describe('Chats Route Integration Tests', () => {
  let testUserId;
  let testChatId;

  beforeAll(async () => {
    // Create a test user
    const email = `test-chat-${Date.now()}@example.com`;
    testUserId = await db.createUser({ email, username: 'testuser', passwordHash: 'hash' });
  });

  afterAll(async () => {
    // Clean up
    if (testUserId) {
      // Deleting user cascades to chats and messages
      await db.deleteUser(testUserId);
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/chats', () => {
    it('should create a new chat and return a welcome message', async () => {
      const res = await request(app)
        .post('/api/chats')
        .send({ userId: testUserId, title: 'Integration Test Chat' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('welcomeMessage');
      expect(res.body.welcomeMessage).toContain('Halo!');

      testChatId = res.body.id;

      // Verify the welcome message was saved to DB
      const messages = await db.listMessagesByChat(testChatId);
      expect(messages.length).toBe(1);
      expect(messages[0].role).toBe('assistant');
      expect(messages[0].content).toContain('Halo!');
    });
  });

  describe('PATCH /api/chats/:id', () => {
    it('should rename a chat session', async () => {
      const res = await request(app)
        .patch(`/api/chats/${testChatId}`)
        .send({ title: 'Updated Chat Title' });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated Chat Title');
    });

    it('should return 400 if title is missing', async () => {
      const res = await request(app)
        .patch(`/api/chats/${testChatId}`)
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/chats/:chatId/messages', () => {
    it('should save user message and return AI reply', async () => {
      const aiResponse = 'BVA is Boundary Value Analysis.';
      aiService.chat.mockImplementationOnce(async (cId, uId, msg) => {
        await db.addMessage(cId, uId, 'user', msg);
        await db.addMessage(cId, uId, 'assistant', aiResponse);
        return {
          reply: aiResponse,
          queuePosition: 0,
          queueLength: 1,
        };
      });

      const res = await request(app)
        .post(`/api/chats/${testChatId}/messages`)
        .send({ userId: testUserId, content: 'What is BVA?' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('userMessageId');
      expect(res.body.assistantReply).toBe(aiResponse);

      // Verify both messages are in DB
      const messages = await db.listMessagesByChat(testChatId);
      expect(messages.length).toBe(3); // welcome + user + assistant
      expect(messages[1].role).toBe('user');
      expect(messages[1].content).toBe('What is BVA?');
      expect(messages[2].role).toBe('assistant');
      expect(messages[2].content).toBe(aiResponse);
    });

    it('should handle AI service failure gracefully', async () => {
      aiService.chat.mockRejectedValueOnce(new Error('API quota exceeded'));

      const res = await request(app)
        .post(`/api/chats/${testChatId}/messages`)
        .send({ userId: testUserId, content: 'Will this fail?' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.assistantReply).toBeNull();
      expect(res.body.aiError).toBe('API quota exceeded');

      // Verify user message was still saved
      const messages = await db.listMessagesByChat(testChatId);
      expect(messages[messages.length - 1].role).toBe('user');
      expect(messages[messages.length - 1].content).toBe('Will this fail?');
    });
  });

  describe('POST /api/chats/:chatId/explain-bug', () => {
    it('should return structured explanation for a bug', async () => {
      const mockExplanation = {
        errorExplanation: 'Null pointer',
        possibleCauses: ['x is null'],
        debuggingSteps: ['Check x'],
      };
      aiService.explainBug.mockResolvedValueOnce({
        result: { result: mockExplanation, warnings: [] },
        queuePosition: 0,
        queueLength: 1,
      });

      const res = await request(app)
        .post(`/api/chats/${testChatId}/explain-bug`)
        .send({ userId: testUserId, errorLog: 'TypeError: Cannot read properties of null' });

      expect(res.status).toBe(201);
      expect(res.body.explanation).toEqual(mockExplanation);

      // Verify messages were saved
      const messages = await db.listMessagesByChat(testChatId);
      expect(messages[messages.length - 2].content).toContain('[Bug Explainer]');
      expect(messages[messages.length - 2].content).toContain('TypeError');
      expect(messages[messages.length - 1].role).toBe('assistant');
    });

    it('should return 503 if AI service fails', async () => {
      aiService.explainBug.mockRejectedValueOnce(new Error('Network error'));

      const res = await request(app)
        .post(`/api/chats/${testChatId}/explain-bug`)
        .send({ userId: testUserId, errorLog: 'Another error' });

      expect(res.status).toBe(503);
      expect(res.body.error).toBe('AI service unavailable');
    });
  });

  describe('GET /api/chats/search', () => {
    it('should return matching chats for a keyword', async () => {
      const res = await request(app)
        .get(`/api/chats/search?userId=${testUserId}&q=BVA`)
        .expect(200);

      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data[0].id).toBe(testChatId);
    });

    it('should return empty array for non-matching keyword', async () => {
      const res = await request(app)
        .get(`/api/chats/search?userId=${testUserId}&q=nonexistentkeyword123`)
        .expect(200);

      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(0);
      expect(res.body.total).toBe(0);
    });

    it('should require q parameter', async () => {
      await request(app)
        .get(`/api/chats/search?userId=${testUserId}`)
        .expect(400);
    });
  });

  describe('DELETE /api/chats/:id', () => {
    it('should delete the chat session and its messages', async () => {
      await request(app)
        .delete(`/api/chats/${testChatId}`)
        .expect(204);

      // Verify it's gone
      const chats = await db.listChatsByUser(testUserId);
      expect(chats.length).toBe(0);
    });
  });
});

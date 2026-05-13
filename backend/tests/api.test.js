/**
 * Integration tests for Express API endpoints.
 *
 * Uses supertest to make HTTP requests against the Express app.
 * Requires PostgreSQL running and migrations applied before running.
 *
 *   docker-compose up -d
 *   npm run db:migrate
 *   npm test
 */

require('dotenv').config();

const request = require('supertest');
const app = require('../src/index');
const db = require('../src/data/repository');

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function clearAll() {
  await db.pool.query('DELETE FROM export_history');
  await db.pool.query('DELETE FROM uploaded_files');
  await db.pool.query('DELETE FROM generated_test_cases');
  await db.pool.query('DELETE FROM messages');
  await db.pool.query('DELETE FROM chats');
  await db.pool.query('DELETE FROM users');
}

let testUserId;

beforeAll(async () => {
  await clearAll();
  // Seed a test user directly via DB
  testUserId = await db.createUser({
    email: 'integration@test.com',
    username: 'intuser',
    passwordHash: 'hash123',
  });
});

afterAll(async () => {
  await clearAll();
  await db.pool.end();
});

// ─── Health ──────────────────────────────────────────────────────────────────

describe('GET /health', () => {
  it('returns 200 ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

// ─── Users ───────────────────────────────────────────────────────────────────

describe('Users API', () => {
  let createdId;

  it('POST /api/users – creates a user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ email: 'new@test.com', username: 'newbie', passwordHash: 'hashed' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeTruthy();
    createdId = res.body.id;
  });

  it('POST /api/users – 400 on missing email', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ username: 'nomail', passwordHash: 'x' });
    expect(res.status).toBe(400);
  });

  it('POST /api/users – 409 on duplicate email', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ email: 'new@test.com', username: 'dup', passwordHash: 'y' });
    expect(res.status).toBe(409);
  });

  it('GET /api/users/:id – returns user', async () => {
    const res = await request(app).get(`/api/users/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('new@test.com');
    expect(res.body.password_hash).toBeUndefined();
  });

  it('GET /api/users/:id – 404 for unknown id', async () => {
    const res = await request(app).get('/api/users/00000000-0000-0000-0000-000000000000');
    expect(res.status).toBe(404);
  });

  it('PATCH /api/users/:id – updates username', async () => {
    const res = await request(app)
      .patch(`/api/users/${createdId}`)
      .send({ username: 'updated' });
    expect(res.status).toBe(200);
  });

  it('DELETE /api/users/:id – removes user', async () => {
    const res = await request(app).delete(`/api/users/${createdId}`);
    expect(res.status).toBe(204);
  });
});

// ─── Chats & Messages ────────────────────────────────────────────────────────

describe('Chats API', () => {
  let chatId;

  it('POST /api/chats – creates a chat', async () => {
    const res = await request(app)
      .post('/api/chats')
      .send({ userId: testUserId, title: 'My Chat' });
    expect(res.status).toBe(201);
    chatId = res.body.id;
  });

  it('POST /api/chats – creates chat with initialMessage', async () => {
    const res = await request(app)
      .post('/api/chats')
      .send({ userId: testUserId, title: 'With Msg', initialMessage: 'Hello!' });
    expect(res.status).toBe(201);
    const msgs = await db.listMessagesByChat(res.body.id);
    expect(msgs[0].content).toBe('Hello!');
  });

  it('GET /api/chats?userId= – lists chats', async () => {
    const res = await request(app).get(`/api/chats?userId=${testUserId}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/chats/:chatId/messages – adds a message', async () => {
    const res = await request(app)
      .post(`/api/chats/${chatId}/messages`)
      .send({ userId: testUserId, role: 'user', content: 'Test message' });
    expect(res.status).toBe(201);
  });

  it('GET /api/chats/:chatId/messages – returns messages', async () => {
    const res = await request(app).get(`/api/chats/${chatId}/messages`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('DELETE /api/chats/:id – removes chat', async () => {
    const res = await request(app).delete(`/api/chats/${chatId}`);
    expect(res.status).toBe(204);
  });
});

// ─── Test Cases ──────────────────────────────────────────────────────────────

describe('Test Cases API', () => {
  it('POST /api/test-cases – creates a test case', async () => {
    const res = await request(app)
      .post('/api/test-cases')
      .send({
        userId: testUserId,
        input: 'Search with boundary values',
        output: [{ name: 'TC-001' }],
        method: 'BVA',
        type: 'blackbox',
      });
    expect(res.status).toBe(201);
  });

  it('GET /api/test-cases?userId= – lists test cases', async () => {
    const res = await request(app).get(`/api/test-cases?userId=${testUserId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/test-cases/search?userId=&q= – full-text search', async () => {
    const res = await request(app)
      .get(`/api/test-cases/search?userId=${testUserId}&q=boundary`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/test-cases/search – 400 if q missing', async () => {
    const res = await request(app)
      .get(`/api/test-cases/search?userId=${testUserId}`);
    expect(res.status).toBe(400);
  });
});

// ─── Files ───────────────────────────────────────────────────────────────────

describe('Files API', () => {
  let fileId;

  it('POST /api/files – records a file upload', async () => {
    const res = await request(app)
      .post('/api/files')
      .send({
        userId: testUserId,
        filename: 'code.js',
        path: '/uploads/code.js',
        type: 'source_code',
        size: 2048,
      });
    expect(res.status).toBe(201);
    fileId = res.body.id;
  });

  it('GET /api/files?userId= – lists files', async () => {
    const res = await request(app).get(`/api/files?userId=${testUserId}`);
    expect(res.status).toBe(200);
    expect(res.body.data[0].path).toBeUndefined(); // security: no path exposed
  });

  it('DELETE /api/files/:id – removes file record', async () => {
    const res = await request(app).delete(`/api/files/${fileId}`);
    expect(res.status).toBe(204);
  });
});

// ─── Exports ─────────────────────────────────────────────────────────────────

describe('Exports API', () => {
  it('POST /api/exports – logs an export', async () => {
    const res = await request(app)
      .post('/api/exports')
      .send({
        userId: testUserId,
        format: 'CSV',
        testCaseCount: 10,
        filePath: '/exports/tc.csv',
      });
    expect(res.status).toBe(201);
  });

  it('POST /api/exports – 400 on invalid format', async () => {
    const res = await request(app)
      .post('/api/exports')
      .send({ userId: testUserId, format: 'TXT', testCaseCount: 1, filePath: '/a.txt' });
    expect(res.status).toBe(400);
  });

  it('GET /api/exports?userId= – lists export history', async () => {
    const res = await request(app).get(`/api/exports?userId=${testUserId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });
});

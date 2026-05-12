/**
 * Unit tests for src/data/repository.js
 *
 * Requires a real PostgreSQL instance (use Docker):
 *   docker-compose up -d
 *   npm run db:migrate
 *   npm test
 *
 * Set PGDATABASE to a dedicated test DB to avoid polluting dev data.
 */

require('dotenv').config();

const db = require('../src/data/repository');

// Cleanup helpers
async function clearAll() {
  await db.pool.query('DELETE FROM export_history');
  await db.pool.query('DELETE FROM uploaded_files');
  await db.pool.query('DELETE FROM generated_test_cases');
  await db.pool.query('DELETE FROM messages');
  await db.pool.query('DELETE FROM chats');
  await db.pool.query('DELETE FROM users');
}

beforeAll(async () => {
  await clearAll();
});

afterAll(async () => {
  await clearAll();
  await db.pool.end();
});

// ─── Users ─────────────────────────────────────────────────────────────────

describe('Users', () => {
  let userId;

  test('createUser returns a UUID', async () => {
    userId = await db.createUser({
      email: 'alice@test.com',
      username: 'alice',
      passwordHash: 'hashed_pw',
    });
    expect(typeof userId).toBe('string');
    expect(userId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });

  test('getUserById returns user without password_hash', async () => {
    const user = await db.getUserById(userId);
    expect(user).toBeTruthy();
    expect(user.email).toBe('alice@test.com');
    expect(user.username).toBe('alice');
    expect(user.password_hash).toBeUndefined();
  });

  test('getUserByEmail returns user with password_hash', async () => {
    const user = await db.getUserByEmail('alice@test.com');
    expect(user).toBeTruthy();
    expect(user.password_hash).toBe('hashed_pw');
  });

  test('updateUser changes username', async () => {
    await db.updateUser(userId, { username: 'alice_updated' });
    const user = await db.getUserById(userId);
    expect(user.username).toBe('alice_updated');
  });

  test('createUser throws DatabaseError on duplicate email', async () => {
    await expect(
      db.createUser({ email: 'alice@test.com', username: 'dup', passwordHash: 'x' })
    ).rejects.toMatchObject({ code: '23505' });
  });

  test('getUserById returns null for unknown id', async () => {
    const user = await db.getUserById('00000000-0000-0000-0000-000000000000');
    expect(user).toBeNull();
  });
});

// ─── Chats & Messages ───────────────────────────────────────────────────────

describe('Chats & Messages', () => {
  let userId, chatId;

  beforeAll(async () => {
    userId = await db.createUser({
      email: 'bob@test.com',
      username: 'bob',
      passwordHash: 'pw',
    });
  });

  test('createChat returns a UUID', async () => {
    chatId = await db.createChat(userId, 'Test Chat');
    expect(chatId).toBeTruthy();
  });

  test('listChatsByUser returns the created chat', async () => {
    const chats = await db.listChatsByUser(userId);
    expect(chats.length).toBeGreaterThanOrEqual(1);
    expect(chats[0].id).toBe(chatId);
  });

  test('addMessage inserts and returns UUID', async () => {
    const msgId = await db.addMessage(chatId, userId, 'user', 'Hello!');
    expect(msgId).toBeTruthy();
  });

  test('listMessagesByChat returns messages in ASC order', async () => {
    await db.addMessage(chatId, userId, 'assistant', 'Hi there!');
    const msgs = await db.listMessagesByChat(chatId);
    expect(msgs.length).toBe(2);
    expect(msgs[0].role).toBe('user');
    expect(msgs[1].role).toBe('assistant');
  });

  test('createChatWithMessage uses transaction successfully', async () => {
    const newChatId = await db.createChatWithMessage(userId, 'Transactional Chat', 'First msg');
    const msgs = await db.listMessagesByChat(newChatId);
    expect(msgs.length).toBe(1);
    expect(msgs[0].content).toBe('First msg');
  });

  test('deleteChatById removes chat and messages (cascade)', async () => {
    await db.deleteChatById(chatId);
    const msgs = await db.listMessagesByChat(chatId);
    expect(msgs.length).toBe(0);
  });
});

// ─── Test Cases ─────────────────────────────────────────────────────────────

describe('Generated Test Cases', () => {
  let userId;

  beforeAll(async () => {
    userId = await db.createUser({
      email: 'carol@test.com',
      username: 'carol',
      passwordHash: 'pw',
    });
  });

  test('storeGeneratedTestCase returns a UUID', async () => {
    const id = await db.storeGeneratedTestCase({
      userId,
      input: 'Login feature with boundary values',
      output: [{ name: 'TC-001', steps: ['open app'] }],
      method: 'BVA',
      type: 'blackbox',
    });
    expect(id).toBeTruthy();
  });

  test('listTestCasesByUser returns paginated results', async () => {
    const items = await db.listTestCasesByUser(userId, 10, 0);
    expect(items.length).toBeGreaterThanOrEqual(1);
  });

  test('searchTestCases finds by keyword', async () => {
    const results = await db.searchTestCases(userId, 'boundary');
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].input).toContain('boundary');
  });
});

// ─── Uploaded Files ─────────────────────────────────────────────────────────

describe('Uploaded Files', () => {
  let userId, fileId;

  beforeAll(async () => {
    userId = await db.createUser({
      email: 'dave@test.com',
      username: 'dave',
      passwordHash: 'pw',
    });
  });

  test('recordUpload returns a UUID', async () => {
    fileId = await db.recordUpload({
      userId,
      filename: 'code.js',
      path: '/uploads/code.js',
      type: 'source_code',
      size: 1024,
    });
    expect(fileId).toBeTruthy();
  });

  test('listUploadedFiles does NOT expose path directly', async () => {
    const files = await db.listUploadedFiles(userId);
    expect(files.length).toBeGreaterThanOrEqual(1);
    expect(files[0].path).toBeUndefined(); // path excluded
    expect(files[0].filename).toBe('code.js');
  });

  test('deleteUploadedFile removes the record', async () => {
    await db.deleteUploadedFile(fileId);
    const files = await db.listUploadedFiles(userId);
    expect(files.find(f => f.id === fileId)).toBeUndefined();
  });
});

// ─── Export History ──────────────────────────────────────────────────────────

describe('Export History', () => {
  let userId;

  beforeAll(async () => {
    userId = await db.createUser({
      email: 'eve@test.com',
      username: 'eve',
      passwordHash: 'pw',
    });
  });

  test('logExport returns a UUID', async () => {
    const id = await db.logExport({
      userId,
      format: 'CSV',
      testCaseCount: 5,
      filePath: '/exports/tc.csv',
    });
    expect(id).toBeTruthy();
  });

  test('listExportHistory returns records in DESC order', async () => {
    await db.logExport({ userId, format: 'JSON', testCaseCount: 3, filePath: '/exports/tc.json' });
    const history = await db.listExportHistory(userId);
    expect(history.length).toBe(2);
    expect(history[0].format).toBe('JSON'); // newest first
  });
});

const { Pool } = require('pg');
const { DatabaseError } = require('../middleware/errorHandler');
const { prisma } = require('../config/prisma');


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Graceful shutdown
const shutdown = async () => { await pool.end(); process.exit(0); };
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// ---------------------------------------------------------------------------
// Retry wrapper for transient connection failures (exponential backoff)
// ---------------------------------------------------------------------------
const RETRY_DELAYS = [1000, 2000, 4000]; // 3 attempts: 1s, 2s, 4s

async function retryConnect() {
  let lastErr;
  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    try {
      return await pool.connect();
    } catch (err) {
      lastErr = err;
      if (attempt < RETRY_DELAYS.length) {
        const delay = RETRY_DELAYS[attempt];
        console.warn(
          `DB connection attempt ${attempt + 1} failed (${err.message}), retrying in ${delay}ms...`
        );
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error(
    `Failed to acquire DB connection after ${RETRY_DELAYS.length + 1} attempts: ${lastErr.message}`
  );
}

// ---------------------------------------------------------------------------
// Transaction helper
// ---------------------------------------------------------------------------
async function withTransaction(callback) {
  const client = await retryConnect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------
async function createUser({ email, username, passwordHash }) {
  const res = await pool.query(
    `INSERT INTO users (email, username, password_hash, created_at, updated_at)
     VALUES ($1, $2, $3, now(), now())
     RETURNING id`,
    [email, username, passwordHash]
  );
  return res.rows[0].id;
}

async function getUserById(userId) {
  const res = await pool.query(
    `SELECT id, email, username, created_at, updated_at
     FROM users WHERE id = $1`,
    [userId]
  );
  return res.rows[0] || null;
}

async function getUserByEmail(email) {
  const res = await pool.query(
    `SELECT id, email, username, password_hash, created_at, updated_at
     FROM users WHERE email = $1`,
    [email]
  );
  return res.rows[0] || null;
}

async function updateUser(userId, fields) {
  const allowed = ['email', 'username', 'password_hash'];
  const setClauses = [];
  const values = [];
  let idx = 1;
  for (const key of allowed) {
    if (fields[key] !== undefined) {
      setClauses.push(`${key} = $${idx++}`);
      values.push(fields[key]);
    }
  }
  if (setClauses.length === 0) return;
  setClauses.push(`updated_at = now()`);
  values.push(userId);
  await pool.query(
    `UPDATE users SET ${setClauses.join(', ')} WHERE id = $${idx}`,
    values
  );
}

async function deleteUser(userId) {
  await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);
}

// ---------------------------------------------------------------------------
// Chats
// ---------------------------------------------------------------------------
async function createChat(userId, title, context = null) {
  const chat = await prisma.conversation.create({
    data: {
      userId,
      title,
      context: context || undefined,
    },
  });
  return chat.id;
}

async function createChatWithMessage(userId, title, messageContent, context = null) {
  const chat = await prisma.conversation.create({
    data: {
      userId,
      title,
      context: context || undefined,
      messages: {
        create: {
          role: 'USER',
          content: messageContent,
        },
      },
    },
  });
  return chat.id;
}

async function getChatById(chatId) {
  return prisma.conversation.findUnique({
    where: { id: chatId },
  });
}

async function updateChatContext(chatId, context) {
  await prisma.conversation.update({
    where: { id: chatId },
    data: { context: context || undefined },
  });
}

async function listChatsByUser(userId, limit = 20, offset = 0) {
  return prisma.conversation.findMany({
    where: { userId },
    take: limit,
    skip: offset,
    orderBy: { updatedAt: 'desc' },
  });
}

async function deleteChatById(chatId) {
  await prisma.conversation.delete({
    where: { id: chatId },
  });
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------
async function addMessage(chatId, userId, role, content) {
  const message = await prisma.message.create({
    data: {
      conversationId: chatId,
      role: role.toUpperCase(),
      content,
    },
  });
  // Bump updated_at
  await prisma.conversation.update({
    where: { id: chatId },
    data: { updatedAt: new Date() },
  });
  return message.id;
}

async function listMessagesByChat(chatId, limit = 100, offset = 0) {
  const messages = await prisma.message.findMany({
    where: { conversationId: chatId },
    take: limit,
    skip: offset,
    orderBy: { createdAt: 'asc' },
  });
  return messages.map(msg => ({
    ...msg,
    role: msg.role.toLowerCase(),
  }));
}

// ---------------------------------------------------------------------------
// Generated Test Cases
// ---------------------------------------------------------------------------
async function storeGeneratedTestCase({ userId, input, output, method, type }) {
  const res = await pool.query(
    `INSERT INTO generated_test_cases (user_id, input, output, method, type, created_at)
     VALUES ($1, $2, $3, $4, $5, now()) RETURNING id`,
    [userId, input, JSON.stringify(output), method, type]
  );
  return res.rows[0].id;
}

async function listTestCasesByUser(userId, limit = 20, offset = 0) {
  const res = await pool.query(
    `SELECT id, input, output, method, type, created_at FROM generated_test_cases
     WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return res.rows;
}

async function searchTestCases(userId, keyword, limit = 20, offset = 0) {
  const res = await pool.query(
    `SELECT id, input, output, method, type, created_at,
            ts_rank(to_tsvector('english', input || ' ' || output::text),
                    plainto_tsquery($2)) AS rank
     FROM generated_test_cases
     WHERE user_id = $1
       AND to_tsvector('english', input || ' ' || output::text) @@ plainto_tsquery($2)
     ORDER BY rank DESC LIMIT $3 OFFSET $4`,
    [userId, keyword, limit, offset]
  );
  return res.rows;
}

// ---------------------------------------------------------------------------
// Uploaded Files
// ---------------------------------------------------------------------------
async function recordUpload({ userId, filename, path, type, size }) {
  const res = await pool.query(
    `INSERT INTO uploaded_files (user_id, filename, path, type, size, uploaded_at)
     VALUES ($1, $2, $3, $4, $5, now()) RETURNING id`,
    [userId, filename, path, type, size]
  );
  return res.rows[0].id;
}

async function listUploadedFiles(userId, limit = 20, offset = 0) {
  const res = await pool.query(
    `SELECT id, filename, type, size, uploaded_at FROM uploaded_files
     WHERE user_id = $1 ORDER BY uploaded_at DESC LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return res.rows;
}

async function deleteUploadedFile(fileId) {
  await pool.query(`DELETE FROM uploaded_files WHERE id = $1`, [fileId]);
}

// ---------------------------------------------------------------------------
// Export History
// ---------------------------------------------------------------------------
async function logExport({ userId, format, testCaseCount, filePath }) {
  const res = await pool.query(
    `INSERT INTO export_history (user_id, format, test_case_count, file_path, created_at)
     VALUES ($1, $2, $3, $4, now()) RETURNING id`,
    [userId, format, testCaseCount, filePath]
  );
  return res.rows[0].id;
}

async function listExportHistory(userId, limit = 20, offset = 0) {
  const res = await pool.query(
    `SELECT id, format, test_case_count, file_path, created_at FROM export_history
     WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return res.rows;
}

// ---------------------------------------------------------------------------
// Chat Extras (rename, search)
// ---------------------------------------------------------------------------
async function updateChatTitle(chatId, title) {
  const res = await pool.query(
    `UPDATE chats SET title = $1, updated_at = now() WHERE id = $2
     RETURNING id, user_id, title, created_at, updated_at`,
    [title, chatId]
  );
  return res.rows[0] || null;
}

async function searchChatMessages(userId, keyword, limit = 20, offset = 0) {
  const res = await pool.query(
    `SELECT * FROM (
       SELECT DISTINCT ON (c.id)
         c.id,
         c.title,
         c.context,
         c.created_at,
         c.updated_at,
         ts_rank_cd(
           setweight(to_tsvector('english', coalesce(c.title, '')), 'A') ||
           setweight(to_tsvector('english', coalesce(c.context::text, '')), 'B') ||
           setweight(to_tsvector('english', coalesce(m.content, '')), 'C'),
           plainto_tsquery('english', $2)
         ) AS rank,
         ts_headline(
           'english',
           m.content,
           plainto_tsquery('english', $2),
           'MaxFragments=1, MinWords=5, MaxWords=20'
         ) AS preview
       FROM chats c
       JOIN messages m ON m.chat_id = c.id
       WHERE c.user_id = $1
         AND (
           to_tsvector('english', coalesce(c.title, '') || ' ' || coalesce(c.context::text, '')) @@ plainto_tsquery('english', $2)
           OR to_tsvector('english', coalesce(m.content, '')) @@ plainto_tsquery('english', $2)
         )
       ORDER BY c.id, rank DESC
     ) AS sub
     ORDER BY rank DESC
     LIMIT $3 OFFSET $4`,
    [userId, keyword, limit, offset]
  );
  return res.rows;
}

function wrap(fn) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (err) {
      if (err instanceof DatabaseError) throw err;
      throw new DatabaseError(err.message, err.code, err.detail, err.constraint);
    }
  };
}

module.exports = {
  pool,
  withTransaction,
  // users
  createUser: wrap(createUser), 
  getUserById: wrap(getUserById), 
  getUserByEmail: wrap(getUserByEmail), 
  updateUser: wrap(updateUser), 
  deleteUser: wrap(deleteUser),
  // chats
  createChat: wrap(createChat), 
  createChatWithMessage: wrap(createChatWithMessage), 
  listChatsByUser: wrap(listChatsByUser), 
  getChatById: wrap(getChatById),
  updateChatContext: wrap(updateChatContext),
  deleteChatById: wrap(deleteChatById),
  updateChatTitle: wrap(updateChatTitle),
  searchChatMessages: wrap(searchChatMessages),
  // messages
  addMessage: wrap(addMessage), 
  listMessagesByChat: wrap(listMessagesByChat),
  // test cases
  storeGeneratedTestCase: wrap(storeGeneratedTestCase), 
  listTestCasesByUser: wrap(listTestCasesByUser), 
  searchTestCases: wrap(searchTestCases),
  // files
  recordUpload: wrap(recordUpload), 
  listUploadedFiles: wrap(listUploadedFiles), 
  deleteUploadedFile: wrap(deleteUploadedFile),
  // exports
  logExport: wrap(logExport), 
  listExportHistory: wrap(listExportHistory),
};

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const usersRouter = require('./routes/users');
const chatsRouter = require('./routes/chats');
const testCasesRouter = require('./routes/testCases');
const filesRouter = require('./routes/files');
const exportsRouter = require('./routes/exports');
const { dbErrorHandler, notFoundHandler, generalErrorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// Request logging (skip in test to keep output clean)
if (process.env.NODE_ENV !== 'test') {
  const format = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
  app.use(morgan(format));
}

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Routes
app.use('/api/users', usersRouter);
app.use('/api/chats', chatsRouter);
app.use('/api/test-cases', testCasesRouter);
app.use('/api/files', filesRouter);
app.use('/api/exports', exportsRouter);

// 404 catch-all (must be after all route registrations)
app.use(notFoundHandler);

// Error handling (order matters)
app.use(dbErrorHandler);
app.use(generalErrorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

module.exports = app;

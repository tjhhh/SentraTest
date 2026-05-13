/**
 * DatabaseError – wraps pg errors with code, detail, constraint
 */
class DatabaseError extends Error {
  constructor(message, code, detail, constraint) {
    super(message);
    this.name = 'DatabaseError';
    this.code = code;
    this.detail = detail;
    this.constraint = constraint;
  }
}

/**
 * Express error-handling middleware.
 * Maps PostgreSQL error codes to HTTP status codes.
 */
function dbErrorHandler(err, req, res, next) {
  if (err.name !== 'DatabaseError') return next(err);

  const codeMap = {
    '23505': { status: 409, message: err.detail || 'Duplicate entry' },
    '23503': { status: 400, message: err.detail || 'Foreign key violation' },
    '23502': { status: 400, message: err.detail || 'Not-null constraint violation' },
  };

  const mapped = codeMap[err.code];
  if (mapped) {
    console.error(`[DatabaseError] ${req.method} ${req.originalUrl}`, err.stack || err);
    return res.status(mapped.status).json({ error: mapped.message });
  }

  console.error(`[DatabaseError] ${req.method} ${req.originalUrl}`, err.stack || err);

  return res.status(500).json({
    error: err.message,     // Menampilkan pesan error asli PG
    code: err.code,         // Menampilkan kode error PostgreSQL
    detail: err.detail,     // Menampilkan detail spesifik
    stack: err.stack        // Menampilkan tumpukan baris kode yang rusak
  });
}

/**
 * 404 catch-all — placed after all route registrations, before error handlers.
 */
function notFoundHandler(req, res, _next) {
  res.status(404).json({ error: 'API endpoint not found' });
}

/**
 * Global error handler (non-DB errors).
 * Environment-aware: returns stack traces in development, generic messages in production.
 */
function generalErrorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500;

  // Always log the full error with stack trace and request context
  console.error(`[Error] ${req.method} ${req.originalUrl} — ${err.message}`);
  console.error(err.stack || err);

  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    res.status(status).json({
      error: err.message || 'Internal Server Error',
      stack: err.stack,
    });
  } else {
    res.status(status).json({
      error: status === 500 ? 'Internal Server Error' : (err.message || 'Internal Server Error'),
    });
  }
}

module.exports = { DatabaseError, dbErrorHandler, notFoundHandler, generalErrorHandler };

const { Router } = require('express');
const { body, query, validationResult } = require('express-validator');
const db = require('../data/repository');
const { DatabaseError } = require('../middleware/errorHandler');

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// POST /exports
router.post(
  '/',
  [
    body('userId').isUUID(),
    body('format').isIn(['CSV', 'JSON', 'Excel', 'PDF']).withMessage("format must be CSV, JSON, Excel, or PDF"),
    body('testCaseCount').isInt({ min: 0 }),
    body('filePath').notEmpty(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { userId, format, testCaseCount, filePath } = req.body;
      const id = await db.logExport({ userId, format, testCaseCount, filePath });
      res.status(201).json({ id });
    } catch (err) {
      next(err);
    }
  }
);

// GET /exports?userId=&limit=&offset=
router.get(
  '/',
  [
    query('userId').isUUID(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 }),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { userId, limit = 20, offset = 0 } = req.query;
      const items = await db.listExportHistory(userId, Number(limit), Number(offset));
      res.json({ data: items, limit: Number(limit), offset: Number(offset) });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;

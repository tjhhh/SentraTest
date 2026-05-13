const { Router } = require('express');
const { body, param, query, validationResult } = require('express-validator');
const db = require('../data/repository');
const { DatabaseError } = require('../middleware/errorHandler');

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// POST /test-cases
router.post(
  '/',
  [
    body('userId').isUUID(),
    body('input').notEmpty().withMessage('input required'),
    body('output').notEmpty().withMessage('output required'),
    body('method').optional().isString(),
    body('type').optional().isIn(['blackbox', 'whitebox']),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { userId, input, output, method, type } = req.body;
      const id = await db.storeGeneratedTestCase({ userId, input, output, method, type });
      res.status(201).json({ id });
    } catch (err) {
      next(err);
    }
  }
);

// GET /test-cases?userId=&limit=&offset=
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
      const items = await db.listTestCasesByUser(userId, Number(limit), Number(offset));
      res.json({ data: items, limit: Number(limit), offset: Number(offset) });
    } catch (err) {
      next(err);
    }
  }
);

// GET /test-cases/search?userId=&q=&limit=&offset=
router.get(
  '/search',
  [
    query('userId').isUUID(),
    query('q').notEmpty().withMessage('Search keyword (q) required'),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 }),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { userId, q, limit = 20, offset = 0 } = req.query;
      const items = await db.searchTestCases(userId, q, Number(limit), Number(offset));
      res.json({ data: items, limit: Number(limit), offset: Number(offset) });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;

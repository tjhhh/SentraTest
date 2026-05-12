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

// POST /files
router.post(
  '/',
  [
    body('userId').isUUID(),
    body('filename').notEmpty(),
    body('path').notEmpty(),
    body('type').optional().isString(),
    body('size').optional().isInt({ min: 0 }),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { userId, filename, path, type, size } = req.body;
      const id = await db.recordUpload({ userId, filename, path, type, size });
      res.status(201).json({ id });
    } catch (err) {
      next(err);
    }
  }
);

// GET /files?userId=&limit=&offset=
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
      const items = await db.listUploadedFiles(userId, Number(limit), Number(offset));
      res.json({ data: items, limit: Number(limit), offset: Number(offset) });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /files/:id
router.delete(
  '/:id',
  [param('id').isUUID()],
  validate,
  async (req, res, next) => {
    try {
      await db.deleteUploadedFile(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;

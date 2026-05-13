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

// POST /users
router.post(
  '/',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('username').notEmpty().withMessage('username required'),
    body('passwordHash').notEmpty().withMessage('passwordHash required'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { email, username, passwordHash } = req.body;
      const id = await db.createUser({ email, username, passwordHash });
      res.status(201).json({ id });
    } catch (err) {
      next(err);
    }
  }
);

// GET /users/:id
router.get(
  '/:id',
  [param('id').isUUID().withMessage('Valid UUID required')],
  validate,
  async (req, res, next) => {
    try {
      const user = await db.getUserById(req.params.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /users/:id
router.patch(
  '/:id',
  [
    param('id').isUUID(),
    body('email').optional().isEmail(),
    body('username').optional().notEmpty(),
  ],
  validate,
  async (req, res, next) => {
    try {
      await db.updateUser(req.params.id, req.body);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /users/:id
router.delete(
  '/:id',
  [param('id').isUUID()],
  validate,
  async (req, res, next) => {
    try {
      await db.deleteUser(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;

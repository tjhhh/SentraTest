const express = require("express");

const { validate } = require("../../middlewares/validate");
const { authLimiter } = require("../../middlewares/rateLimiters");
const { register, login, refresh, logout } = require("./auth.controller");
const { registerSchema, loginSchema, refreshSchema } = require("./auth.schema");

const router = express.Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrasi pengguna baru
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 8 }
 *     responses:
 *       201:
 *         description: Berhasil daftar
 *       400:
 *         description: Input tidak valid
 */
router.post("/register", authLimiter, validate(registerSchema), register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login pengguna
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login berhasil, mengembalikan token
 *       401:
 *         description: Kredensial salah
 */
router.post("/login", authLimiter, validate(loginSchema), login);

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: Token berhasil diperbarui
 */
router.post("/refresh", authLimiter, validate(refreshSchema), refresh);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout pengguna (revoke refresh token)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: Logout berhasil
 */
router.post("/logout", authLimiter, validate(refreshSchema), logout);

module.exports = { authRoutes: router };

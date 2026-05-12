const express = require("express");

const { validate } = require("../../middlewares/validate");
const { authLimiter } = require("../../middlewares/rateLimiters");
const { register, login, refresh, logout } = require("./auth.controller");
const { registerSchema, loginSchema, refreshSchema } = require("./auth.schema");

const router = express.Router();

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/refresh", authLimiter, validate(refreshSchema), refresh);
router.post("/logout", authLimiter, validate(refreshSchema), logout);

module.exports = { authRoutes: router };

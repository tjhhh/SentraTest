const express = require("express");

const { authMiddleware } = require("../../middlewares/authMiddleware");
const { validate } = require("../../middlewares/validate");
const { generationLimiter } = require("../../middlewares/rateLimiters");
const { analyze, script } = require("./whitebox.controller");
const { analyzeSchema, scriptSchema } = require("./whitebox.schema");

const router = express.Router();

router.use(authMiddleware);
router.post("/analyze", generationLimiter, validate(analyzeSchema), analyze);
router.post("/script", generationLimiter, validate(scriptSchema), script);

module.exports = { whiteboxRoutes: router };

const express = require("express");

const { authMiddleware } = require("../../middlewares/authMiddleware");
const { validate } = require("../../middlewares/validate");
const { generationLimiter } = require("../../middlewares/rateLimiters");
const { generate, script, exportResult } = require("./blackbox.controller");
const { generateSchema, scriptSchema, exportSchema } = require("./blackbox.schema");

const router = express.Router();

router.use(authMiddleware);
router.post("/generate", generationLimiter, validate(generateSchema), generate);
router.post("/script", generationLimiter, validate(scriptSchema), script);
router.post("/export", generationLimiter, validate(exportSchema), exportResult);

module.exports = { blackboxRoutes: router };

const express = require("express");

const { authMiddleware } = require("../../middlewares/authMiddleware");
const { validate } = require("../../middlewares/validate");
const { bugExplainSchema } = require("./bug.schema");
const { explain } = require("./bug.controller");

const router = express.Router();

router.use(authMiddleware);
router.post("/explain", validate(bugExplainSchema), explain);

module.exports = { bugRoutes: router };

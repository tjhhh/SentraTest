const express = require("express");
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { getDashboardStats, getRecentActivity } = require("./system.controller");

const router = express.Router();

router.get("/stats", authMiddleware, getDashboardStats);
router.get("/recent", authMiddleware, getRecentActivity);

module.exports = { systemRoutes: router };

const { successResponse } = require("../../utils/response");
const repository = require("./system.repository");

async function getDashboardStats(req, res, next) {
  try {
    const userId = req.user.id;
    const stats = await repository.getStats(userId);
    return successResponse(res, stats);
  } catch (error) {
    return next(error);
  }
}

async function getRecentActivity(req, res, next) {
  try {
    const userId = req.user.id;
    const activity = await repository.getRecentExecutions(userId);
    return successResponse(res, activity);
  } catch (error) {
    return next(error);
  }
}

module.exports = { getDashboardStats, getRecentActivity };

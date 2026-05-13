const { successResponse } = require("../../utils/response");
const authService = require("./auth.service");

async function register(req, res, next) {
  try {
    const data = await authService.register(req.body);
    return successResponse(res, data, 201);
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const data = await authService.login(req.body);
    return successResponse(res, data);
  } catch (error) {
    return next(error);
  }
}

async function refresh(req, res, next) {
  try {
    const data = await authService.refresh(req.body.refreshToken);
    return successResponse(res, data);
  } catch (error) {
    return next(error);
  }
}

async function logout(req, res, next) {
  try {
    await authService.logout(req.body.refreshToken);
    return successResponse(res, { loggedOut: true });
  } catch (error) {
    return next(error);
  }
}

module.exports = { register, login, refresh, logout };

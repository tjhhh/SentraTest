const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

function authMiddleware(req, _res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    const err = new Error("Missing or invalid authorization header");
    err.status = 401;
    return next(err);
  }

  const token = header.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch (error) {
    const err = new Error(`Invalid access token: ${error instanceof Error ? error.message : "verification failed"}`);
    err.status = 401;
    return next(err);
  }
}

module.exports = { authMiddleware };

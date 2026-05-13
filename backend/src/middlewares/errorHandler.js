const { appLogger } = require("../config/logger");

function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  appLogger.error("Unhandled error", {
    requestId: req.requestId,
    message: err.message,
    stack: err.stack,
  });

  return res.status(status).json({
    success: false,
    error: {
      message: err.message || "Internal server error",
      requestId: req.requestId,
    },
  });
}

module.exports = { errorHandler };

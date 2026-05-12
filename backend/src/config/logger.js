const morgan = require("morgan");

const httpLogger = morgan("combined");

const appLogger = {
  info: (...args) => console.log("[INFO]", ...args),
  warn: (...args) => console.warn("[WARN]", ...args),
  error: (...args) => console.error("[ERROR]", ...args),
};

module.exports = { httpLogger, appLogger };

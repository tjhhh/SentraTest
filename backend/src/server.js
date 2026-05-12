const { app } = require("./app");
const { env } = require("./config/env");
const { appLogger } = require("./config/logger");

const server = app.listen(env.PORT, () => {
  appLogger.info(`Backend listening on port ${env.PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => process.exit(0));
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});

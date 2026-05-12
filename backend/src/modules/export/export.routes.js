const express = require("express");

const { authMiddleware } = require("../../middlewares/authMiddleware");
const { validate } = require("../../middlewares/validate");
const { exportPayloadSchema } = require("./export.schema");
const { exportAny } = require("./export.controller");

const router = express.Router();

router.use(authMiddleware);
router.post("/pdf", validate(exportPayloadSchema), exportAny);
router.post("/zip", validate(exportPayloadSchema), exportAny);
router.post("/docx", validate(exportPayloadSchema), exportAny);
router.post("/json", validate(exportPayloadSchema), exportAny);

module.exports = { exportRoutes: router };

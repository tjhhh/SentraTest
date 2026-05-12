const { successResponse } = require("../../utils/response");
const { exportByFormat } = require("./export.service");

async function exportAny(req, res, next) {
  try {
    const result = await exportByFormat({
      userId: req.user.id,
      format: req.body.format,
      payload: req.body.payload,
      defaultFileName: req.body.fileName || "export",
    });

    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

module.exports = { exportAny };

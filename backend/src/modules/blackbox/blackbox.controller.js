const { successResponse } = require("../../utils/response");
const { exportByFormat } = require("../export/export.service");
const service = require("./blackbox.service");

async function generate(req, res, next) {
  try {
    const data = await service.generate({
      userId: req.user.id,
      conversationId: req.body.conversationId,
      method: req.body.method,
      requirement: req.body.requirement,
      requestId: req.requestId,
    });
    return successResponse(res, data, 201);
  } catch (error) {
    return next(error);
  }
}

async function history(req, res, next) {
  try {
    const data = await service.getHistory(req.params.conversationId);
    if (!data) {
      return res.status(404).json({
        success: false,
        error: { message: "History not found" },
      });
    }
    return successResponse(res, data);
  } catch (error) {
    return next(error);
  }
}

async function script(req, res, next) {
  try {
    const data = await service.generateScript({
      method: "BLACKBOX",
      testCases: req.body.testCases,
    });
    return successResponse(res, data);
  } catch (error) {
    return next(error);
  }
}

async function exportResult(req, res, next) {
  try {
    const result = await exportByFormat({
      userId: req.user.id,
      format: req.body.format,
      payload: req.body.payload,
      defaultFileName: "blackbox-export",
    });

    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

module.exports = { generate, history, script, exportResult };

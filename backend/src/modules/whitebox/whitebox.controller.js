const { successResponse } = require("../../utils/response");
const service = require("./whitebox.service");
const fs = require("fs");
const path = require("path");

async function analyze(req, res, next) {
  try {
    const data = await service.analyze({
      userId: req.user.id,
      conversationId: req.body.conversationId,
      coverageType: req.body.coverageType,
      sourceCode: req.body.sourceCode,
      uiCode: req.body.uiCode,
      requestId: req.requestId,
    });

    return successResponse(res, data);
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
    const data = await service.script({ analysis: req.body.analysis });
    return successResponse(res, data);
  } catch (error) {
    return next(error);
  }
}

async function generate(req, res, next) {
  try {
    const { logicCode, uiCode, coverageType } = req.body;

    const data = await service.generateTestScript({
      logicCode,
      uiCode,
      coverageType,
    });

    return successResponse(res, data);
  } catch (error) {
    return next(error);
  }
}

async function run(req, res, next) {
  try {
    const screenshotsDir = path.join(__dirname, "screenshots");

    // Ensure screenshots directory exists
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    const result = await service.runTestScript(screenshotsDir);

    // Send results as JSON
    return res.json({
      success: true,
      data: {
        exitCode: result.exitCode,
        screenshots: result.screenshots,
        results: result.results,
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { analyze, history, script, generate, run };

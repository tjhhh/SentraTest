const { successResponse } = require("../../utils/response");
const service = require("./whitebox.service");

async function analyze(req, res, next) {
  try {
    const data = await service.analyze({
      userId: req.user.id,
      conversationId: req.body.conversationId,
      coverageType: req.body.coverageType,
      sourceCode: req.body.sourceCode,
      requestId: req.requestId,
    });

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

module.exports = { analyze, script };

const { successResponse } = require("../../utils/response");
const service = require("./bug.service");

async function explain(req, res, next) {
  try {
    const data = await service.explain({
      userId: req.user.id,
      stackTrace: req.body.stackTrace,
      context: req.body.context,
      requestId: req.requestId,
    });

    return successResponse(res, data);
  } catch (error) {
    return next(error);
  }
}

module.exports = { explain };

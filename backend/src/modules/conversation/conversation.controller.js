const { successResponse } = require("../../utils/response");
const service = require("./conversation.service");

async function list(req, res, next) {
  try {
    const data = await service.getConversations(req.user.id);
    return successResponse(res, data);
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  try {
    const data = await service.createConversation(req.user.id, req.body.title);
    return successResponse(res, data, 201);
  } catch (error) {
    return next(error);
  }
}

async function rename(req, res, next) {
  try {
    const data = await service.renameConversation(req.params.id, req.user.id, req.body.title);
    return successResponse(res, data);
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  try {
    await service.removeConversation(req.params.id, req.user.id);
    return successResponse(res, { deleted: true });
  } catch (error) {
    return next(error);
  }
}

async function getMessages(req, res, next) {
  try {
    const data = await service.getMessages(req.params.conversationId, req.user.id);
    return successResponse(res, data);
  } catch (error) {
    return next(error);
  }
}

module.exports = { list, create, rename, remove, getMessages };

const { successResponse } = require("../../utils/response");
const chatService = require("./chat.service");
const { sseService } = require("../../services/sse/sse.service");

async function postChat(req, res, next) {
  try {
    if (req.body.stream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders?.();

      req.on("close", () => {
        if (!res.writableEnded) {
          res.end();
        }
      });

      await chatService.streamChat({
        res,
        userId: req.user.id,
        conversationId: req.body.conversationId,
        message: req.body.message,
        requestId: req.requestId,
      });
      return;
    }

    const data = await chatService.chat({
      userId: req.user.id,
      conversationId: req.body.conversationId,
      message: req.body.message,
      requestId: req.requestId,
    });

    return successResponse(res, data);
  } catch (error) {
    return next(error);
  }
}

async function getHistory(req, res, next) {
  try {
    const data = await chatService.getChatHistory(req.user.id);
    return successResponse(res, data);
  } catch (error) {
    return next(error);
  }
}

function subscribe(req, res) {
  const { conversationId } = req.params;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.write("retry: 5000\n\n");

  sseService.subscribe(conversationId, res);

  const heartbeat = setInterval(() => {
    res.write(`event: heartbeat\ndata: ${JSON.stringify({ ts: Date.now() })}\n\n`);
  }, 15000);

  req.on("close", () => {
    clearInterval(heartbeat);
    sseService.unsubscribe(conversationId, res);
    if (!res.writableEnded) {
      res.end();
    }
  });
}

module.exports = { postChat, getHistory, subscribe };

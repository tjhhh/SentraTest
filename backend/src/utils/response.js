function successResponse(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

function errorResponse(res, message, status = 400, details = null) {
  return res.status(status).json({
    success: false,
    error: {
      message,
      details,
    },
  });
}

module.exports = { successResponse, errorResponse };

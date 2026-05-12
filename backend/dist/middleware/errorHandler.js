"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.errorHandler = errorHandler;
exports.asyncHandler = asyncHandler;
class AppError extends Error {
    constructor(message, statusCode = 500, errorType = 'InternalServerError') {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.errorType = errorType;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
/**
 * Global error handler middleware
 * Must be registered as the last middleware
 */
function errorHandler(error, req, res, next) {
    console.error('[Error]', {
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method,
        error: error.message,
    });
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            error: error.errorType,
            message: error.message,
            status: error.statusCode,
        });
        return;
    }
    // Handle JWT errors
    if (error.name === 'JsonWebTokenError') {
        res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid token',
            status: 401,
        });
        return;
    }
    if (error.name === 'TokenExpiredError') {
        res.status(401).json({
            error: 'Unauthorized',
            message: 'Token has expired',
            status: 401,
        });
        return;
    }
    // Generic error response
    res.status(500).json({
        error: 'InternalServerError',
        message: 'An unexpected error occurred',
        status: 500,
    });
}
/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 */
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
//# sourceMappingURL=errorHandler.js.map
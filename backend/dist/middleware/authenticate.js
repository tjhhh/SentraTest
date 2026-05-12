"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authenticateOptional = authenticateOptional;
const tokens_1 = require("../utils/tokens");
/**
 * Authentication middleware
 * Extracts and verifies JWT token from Authorization header
 * Attaches user payload to request if valid
 */
function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Missing authentication token',
                status: 401,
            });
            return;
        }
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid authorization header format. Use: Bearer <token>',
                status: 401,
            });
            return;
        }
        const token = parts[1];
        const payload = (0, tokens_1.verifyAccessToken)(token);
        if (!payload) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid or expired token',
                status: 401,
            });
            return;
        }
        req.user = payload;
        next();
    }
    catch (error) {
        res.status(401).json({
            error: 'Unauthorized',
            message: 'Token verification failed',
            status: 401,
        });
    }
}
/**
 * Optional authentication middleware
 * Does not fail if token is missing, but verifies if provided
 */
function authenticateOptional(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next();
        }
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
            return next();
        }
        const token = parts[1];
        const payload = (0, tokens_1.verifyAccessToken)(token);
        if (payload) {
            req.user = payload;
        }
        next();
    }
    catch (error) {
        next();
    }
}
//# sourceMappingURL=authenticate.js.map
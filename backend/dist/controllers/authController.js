"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.refresh = refresh;
exports.logout = logout;
const password_1 = require("../utils/password");
const tokens_1 = require("../utils/tokens");
const database_1 = require("../utils/database");
const errorHandler_1 = require("../middleware/errorHandler");
// Simple token blacklist (replace with Redis in production)
const tokenBlacklist = new Set();
/**
 * Register a new user
 */
async function register(req, res) {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            throw new errorHandler_1.AppError('Email and password are required', 400, 'BadRequest');
        }
        if (typeof email !== 'string' || typeof password !== 'string') {
            throw new errorHandler_1.AppError('Email and password must be strings', 400, 'BadRequest');
        }
        // Validate password strength
        const passwordValidation = (0, password_1.validatePasswordStrength)(password);
        if (!passwordValidation.valid) {
            throw new errorHandler_1.AppError(passwordValidation.errors.join('; '), 400, 'BadRequest');
        }
        // Check if password contains email
        if ((0, password_1.passwordContainsEmail)(password, email)) {
            throw new errorHandler_1.AppError('Password cannot contain your email address', 400, 'BadRequest');
        }
        // Check if email already exists
        if ((0, database_1.emailExists)(email.toLowerCase())) {
            throw new errorHandler_1.AppError('Email already registered', 409, 'Conflict');
        }
        // Hash password and create user
        const passwordHash = await (0, password_1.hashPassword)(password);
        const user = (0, database_1.createUser)(email.toLowerCase(), passwordHash, 'user');
        // Generate tokens
        const accessToken = (0, tokens_1.generateAccessToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        const refreshToken = (0, tokens_1.generateRefreshToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        // Set refresh token as HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            accessToken,
        });
    }
    catch (error) {
        if (error instanceof errorHandler_1.AppError) {
            res.status(error.statusCode).json({
                error: error.errorType,
                message: error.message,
                status: error.statusCode,
            });
        }
        else {
            res.status(500).json({
                error: 'InternalServerError',
                message: 'Registration failed',
                status: 500,
            });
        }
    }
}
/**
 * Login with email and password
 */
async function login(req, res) {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            throw new errorHandler_1.AppError('Email and password are required', 400, 'BadRequest');
        }
        // Find user by email
        const user = (0, database_1.findUserByEmail)(email.toLowerCase());
        if (!user) {
            // Don't reveal whether email exists
            throw new errorHandler_1.AppError('Invalid email or password', 401, 'Unauthorized');
        }
        // Verify password
        const passwordMatch = await (0, password_1.verifyPassword)(password, user.passwordHash);
        if (!passwordMatch) {
            throw new errorHandler_1.AppError('Invalid email or password', 401, 'Unauthorized');
        }
        // Generate tokens
        const accessToken = (0, tokens_1.generateAccessToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        const refreshToken = (0, tokens_1.generateRefreshToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        // Set refresh token as HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            accessToken,
        });
    }
    catch (error) {
        if (error instanceof errorHandler_1.AppError) {
            res.status(error.statusCode).json({
                error: error.errorType,
                message: error.message,
                status: error.statusCode,
            });
        }
        else {
            res.status(500).json({
                error: 'InternalServerError',
                message: 'Login failed',
                status: 500,
            });
        }
    }
}
/**
 * Refresh access token using refresh token
 */
async function refresh(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
        if (!refreshToken) {
            throw new errorHandler_1.AppError('Refresh token required', 401, 'Unauthorized');
        }
        // Check if token is blacklisted
        if (tokenBlacklist.has(refreshToken)) {
            throw new errorHandler_1.AppError('Refresh token has been revoked', 401, 'Unauthorized');
        }
        // Verify refresh token
        const payload = (0, tokens_1.verifyRefreshToken)(refreshToken);
        if (!payload) {
            throw new errorHandler_1.AppError('Invalid or expired refresh token', 401, 'Unauthorized');
        }
        // Find user to get current role (in case it changed)
        const user = (0, database_1.findUserByEmail)(payload.email);
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404, 'NotFound');
        }
        // Generate new access token
        const newAccessToken = (0, tokens_1.generateAccessToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        res.status(200).json({
            accessToken: newAccessToken,
        });
    }
    catch (error) {
        if (error instanceof errorHandler_1.AppError) {
            res.status(error.statusCode).json({
                error: error.errorType,
                message: error.message,
                status: error.statusCode,
            });
        }
        else {
            res.status(500).json({
                error: 'InternalServerError',
                message: 'Token refresh failed',
                status: 500,
            });
        }
    }
}
/**
 * Logout user by blacklisting refresh token
 */
async function logout(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
        if (refreshToken) {
            tokenBlacklist.add(refreshToken);
        }
        // Clear refresh token cookie
        res.clearCookie('refreshToken');
        res.status(200).json({
            message: 'Logout successful',
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'InternalServerError',
            message: 'Logout failed',
            status: 500,
        });
    }
}
//# sourceMappingURL=authController.js.map
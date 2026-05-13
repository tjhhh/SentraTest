"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = getMe;
exports.getUsers = getUsers;
exports.updateUserProfile = updateUserProfile;
exports.deleteUserProfile = deleteUserProfile;
const database_1 = require("../utils/database");
const errorHandler_1 = require("../middleware/errorHandler");
/**
 * Get current user profile
 */
async function getMe(req, res) {
    try {
        if (!req.user) {
            throw new errorHandler_1.AppError('Authentication required', 401, 'Unauthorized');
        }
        const user = (0, database_1.findUserById)(req.user.userId);
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404, 'NotFound');
        }
        res.status(200).json({
            id: user.id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
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
                message: 'Failed to fetch user profile',
                status: 500,
            });
        }
    }
}
/**
 * List all users (admin only)
 */
async function getUsers(req, res) {
    try {
        if (!req.user) {
            throw new errorHandler_1.AppError('Authentication required', 401, 'Unauthorized');
        }
        if (req.user.role !== 'admin') {
            throw new errorHandler_1.AppError('Insufficient permissions for this resource', 403, 'Forbidden');
        }
        const allUsers = (0, database_1.getAllUsers)();
        res.status(200).json({
            users: allUsers.map(user => ({
                id: user.id,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            })),
            total: allUsers.length,
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
                message: 'Failed to fetch users',
                status: 500,
            });
        }
    }
}
/**
 * Update user (admin only)
 * Can update: email, role
 */
async function updateUserProfile(req, res) {
    try {
        if (!req.user) {
            throw new errorHandler_1.AppError('Authentication required', 401, 'Unauthorized');
        }
        const { id } = req.params;
        const { email, role } = req.body;
        // Check if user is admin or updating their own profile
        if (req.user.role !== 'admin' && req.user.userId !== id) {
            throw new errorHandler_1.AppError('Insufficient permissions for this resource', 403, 'Forbidden');
        }
        // Get current user
        const user = (0, database_1.findUserById)(id);
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404, 'NotFound');
        }
        // Prepare updates
        const updates = {};
        if (email && email !== user.email) {
            // Check if new email already exists
            if ((0, database_1.findUserByEmail)(email.toLowerCase())) {
                throw new errorHandler_1.AppError('Email already in use', 409, 'Conflict');
            }
            updates.email = email.toLowerCase();
        }
        if (role && req.user.role === 'admin') {
            if (!['admin', 'user', 'guest'].includes(role)) {
                throw new errorHandler_1.AppError('Invalid role', 400, 'BadRequest');
            }
            updates.role = role;
        }
        // Update user
        const updatedUser = (0, database_1.updateUser)(id, updates);
        if (!updatedUser) {
            throw new errorHandler_1.AppError('User not found', 404, 'NotFound');
        }
        res.status(200).json({
            id: updatedUser.id,
            email: updatedUser.email,
            role: updatedUser.role,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
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
                message: 'Failed to update user',
                status: 500,
            });
        }
    }
}
/**
 * Delete user (admin only)
 */
async function deleteUserProfile(req, res) {
    try {
        if (!req.user) {
            throw new errorHandler_1.AppError('Authentication required', 401, 'Unauthorized');
        }
        if (req.user.role !== 'admin') {
            throw new errorHandler_1.AppError('Insufficient permissions for this resource', 403, 'Forbidden');
        }
        const { id } = req.params;
        // Prevent admin from deleting themselves
        if (req.user.userId === id) {
            throw new errorHandler_1.AppError('Cannot delete your own admin account', 400, 'BadRequest');
        }
        const deleted = (0, database_1.deleteUser)(id);
        if (!deleted) {
            throw new errorHandler_1.AppError('User not found', 404, 'NotFound');
        }
        res.status(200).json({
            message: 'User deleted successfully',
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
                message: 'Failed to delete user',
                status: 500,
            });
        }
    }
}
//# sourceMappingURL=userController.js.map
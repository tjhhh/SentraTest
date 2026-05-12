"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authenticate_1 = require("../middleware/authenticate");
const authorize_1 = require("../middleware/authorize");
const router = (0, express_1.Router)();
/**
 * User Routes (all require authentication)
 */
// GET /api/users/me - Get current user profile
router.get('/me', authenticate_1.authenticate, userController_1.getMe);
// GET /api/users - List all users (admin only)
router.get('/', authenticate_1.authenticate, (0, authorize_1.authorize)('admin'), userController_1.getUsers);
// PUT /api/users/:id - Update user (admin or self)
router.put('/:id', authenticate_1.authenticate, userController_1.updateUserProfile);
// DELETE /api/users/:id - Delete user (admin only)
router.delete('/:id', authenticate_1.authenticate, (0, authorize_1.authorize)('admin'), userController_1.deleteUserProfile);
exports.default = router;
//# sourceMappingURL=users.js.map
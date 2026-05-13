"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
/**
 * Auth Routes
 */
// POST /api/auth/register - Register new user
router.post('/register', authController_1.register);
// POST /api/auth/login - Login user
router.post('/login', authController_1.login);
// POST /api/auth/refresh - Refresh access token
router.post('/refresh', authController_1.refresh);
// POST /api/auth/logout - Logout user (requires auth)
router.post('/logout', authenticate_1.authenticate, authController_1.logout);
exports.default = router;
//# sourceMappingURL=auth.js.map
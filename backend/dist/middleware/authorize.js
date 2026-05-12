"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = authorize;
exports.requireOwnership = requireOwnership;
/**
 * Role hierarchy: admin > user > guest
 */
const ROLE_HIERARCHY = {
    admin: 3,
    user: 2,
    guest: 1,
};
/**
 * Check if a user role has permission for required roles
 * Higher roles can access lower-tier endpoints
 */ function hasPermission(userRole, allowedRoles) {
    const userLevel = ROLE_HIERARCHY[userRole] || 0;
    return allowedRoles.some(role => userLevel >= ROLE_HIERARCHY[role]);
}
/**
 * Authorization middleware factory
 * Creates middleware that checks if user has required role
 */
function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Authentication required',
                status: 401,
            });
            return;
        }
        const userRole = req.user.role;
        if (!hasPermission(userRole, allowedRoles)) {
            res.status(403).json({
                error: 'Forbidden',
                message: 'Insufficient permissions for this resource',
                status: 403,
            });
            return;
        }
        next();
    };
}
/**
 * Middleware to check if user is owner of a resource
 * Useful for user-owned endpoints like GET /api/profile
 */
function requireOwnership(req, res, next) {
    if (!req.user) {
        res.status(401).json({
            error: 'Unauthorized',
            message: 'Authentication required',
            status: 401,
        });
        return;
    }
    const requestedUserId = req.params.id || req.query.userId;
    if (requestedUserId && req.user.userId !== requestedUserId) {
        // Allow admins to bypass ownership check
        const userRole = req.user.role;
        if (userRole !== 'admin') {
            res.status(403).json({
                error: 'Forbidden',
                message: 'You can only access your own resources',
                status: 403,
            });
            return;
        }
    }
    next();
}
//# sourceMappingURL=authorize.js.map
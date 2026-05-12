import { Request, Response, NextFunction } from 'express';
type UserRole = 'admin' | 'user' | 'guest';
/**
 * Authorization middleware factory
 * Creates middleware that checks if user has required role
 */
export declare function authorize(...allowedRoles: UserRole[]): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware to check if user is owner of a resource
 * Useful for user-owned endpoints like GET /api/profile
 */
export declare function requireOwnership(req: Request, res: Response, next: NextFunction): void;
export {};
//# sourceMappingURL=authorize.d.ts.map
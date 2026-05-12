import { Request, Response } from 'express';
/**
 * Get current user profile
 */
export declare function getMe(req: Request, res: Response): Promise<void>;
/**
 * List all users (admin only)
 */
export declare function getUsers(req: Request, res: Response): Promise<void>;
/**
 * Update user (admin only)
 * Can update: email, role
 */
export declare function updateUserProfile(req: Request, res: Response): Promise<void>;
/**
 * Delete user (admin only)
 */
export declare function deleteUserProfile(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=userController.d.ts.map
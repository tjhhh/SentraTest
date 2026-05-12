import { Request, Response } from 'express';
/**
 * Register a new user
 */
export declare function register(req: Request, res: Response): Promise<void>;
/**
 * Login with email and password
 */
export declare function login(req: Request, res: Response): Promise<void>;
/**
 * Refresh access token using refresh token
 */
export declare function refresh(req: Request, res: Response): Promise<void>;
/**
 * Logout user by blacklisting refresh token
 */
export declare function logout(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=authController.d.ts.map
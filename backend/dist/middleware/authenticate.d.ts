import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from '../utils/tokens';
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}
/**
 * Authentication middleware
 * Extracts and verifies JWT token from Authorization header
 * Attaches user payload to request if valid
 */
export declare function authenticate(req: Request, res: Response, next: NextFunction): void;
/**
 * Optional authentication middleware
 * Does not fail if token is missing, but verifies if provided
 */
export declare function authenticateOptional(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=authenticate.d.ts.map
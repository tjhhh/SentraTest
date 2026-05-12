import { Request, Response, NextFunction } from 'express';
export declare class AppError extends Error {
    message: string;
    statusCode: number;
    errorType: string;
    constructor(message: string, statusCode?: number, errorType?: string);
}
/**
 * Global error handler middleware
 * Must be registered as the last middleware
 */
export declare function errorHandler(error: Error | AppError, req: Request, res: Response, next: NextFunction): void;
/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 */
export declare function asyncHandler(fn: Function): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map
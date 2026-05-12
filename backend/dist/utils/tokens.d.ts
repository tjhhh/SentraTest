export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}
/**
 * Generate JWT access token (15-minute expiry)
 */
export declare function generateAccessToken(payload: TokenPayload): string;
/**
 * Generate refresh token (7-day expiry)
 */
export declare function generateRefreshToken(payload: TokenPayload): string;
/**
 * Verify and decode access token
 */
export declare function verifyAccessToken(token: string): TokenPayload | null;
/**
 * Verify and decode refresh token
 */
export declare function verifyRefreshToken(token: string): TokenPayload | null;
//# sourceMappingURL=tokens.d.ts.map
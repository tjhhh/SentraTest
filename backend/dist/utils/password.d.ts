/**
 * Hash a password using bcrypt
 */
export declare function hashPassword(password: string): Promise<string>;
/**
 * Verify a password against a hash using constant-time comparison
 */
export declare function verifyPassword(password: string, hash: string): Promise<boolean>;
/**
 * Validate password strength
 * Requirements: at least 8 characters, 1 uppercase, 1 lowercase, 1 number
 */
export declare function validatePasswordStrength(password: string): {
    valid: boolean;
    errors: string[];
};
/**
 * Check if password contains email
 */
export declare function passwordContainsEmail(password: string, email: string): boolean;
//# sourceMappingURL=password.d.ts.map
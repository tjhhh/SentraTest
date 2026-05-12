"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.validatePasswordStrength = validatePasswordStrength;
exports.passwordContainsEmail = passwordContainsEmail;
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_ROUNDS = 12;
/**
 * Hash a password using bcrypt
 */
async function hashPassword(password) {
    return bcrypt_1.default.hash(password, SALT_ROUNDS);
}
/**
 * Verify a password against a hash using constant-time comparison
 */
async function verifyPassword(password, hash) {
    return bcrypt_1.default.compare(password, hash);
}
/**
 * Validate password strength
 * Requirements: at least 8 characters, 1 uppercase, 1 lowercase, 1 number
 */
function validatePasswordStrength(password) {
    const errors = [];
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
/**
 * Check if password contains email
 */
function passwordContainsEmail(password, email) {
    const emailLocalPart = email.split('@')[0].toLowerCase();
    return password.toLowerCase().includes(emailLocalPart);
}
//# sourceMappingURL=password.js.map
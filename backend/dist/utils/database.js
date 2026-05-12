"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = initializeDatabase;
exports.createUser = createUser;
exports.findUserByEmail = findUserByEmail;
exports.findUserById = findUserById;
exports.getAllUsers = getAllUsers;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.emailExists = emailExists;
// In-memory user store (replace with real database)
let users = new Map();
let usersByEmail = new Map();
/**
 * Initialize database with test data
 */
function initializeDatabase() {
    users.clear();
    usersByEmail.clear();
    // Add test users (passwords are hashed in real scenario)
    const adminUser = {
        id: '1',
        email: 'admin@example.com',
        passwordHash: '$2b$12$7W.Y8J7p7nJ7p7p7p7p7p7p7p7p7p7p7p7p7p7p7p7p7p7p7p7p7p7p7', // placeholder
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const regularUser = {
        id: '2',
        email: 'user@example.com',
        passwordHash: '$2b$12$7W.Y8J7p7nJ7p7p7p7p7p7p7p7p7p7p7p7p7p7p7p7p7p7p7p7p7p7p7', // placeholder
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    users.set(adminUser.id, adminUser);
    users.set(regularUser.id, regularUser);
    usersByEmail.set(adminUser.email, adminUser);
    usersByEmail.set(regularUser.email, regularUser);
}
/**
 * Create a new user
 */
function createUser(email, passwordHash, role = 'user') {
    const id = String(users.size + 1);
    const user = {
        id,
        email,
        passwordHash,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    users.set(id, user);
    usersByEmail.set(email, user);
    return user;
}
/**
 * Find user by email
 */
function findUserByEmail(email) {
    return usersByEmail.get(email.toLowerCase());
}
/**
 * Find user by ID
 */
function findUserById(id) {
    return users.get(id);
}
/**
 * Get all users
 */
function getAllUsers() {
    return Array.from(users.values());
}
/**
 * Update user
 */
function updateUser(id, updates) {
    const user = users.get(id);
    if (!user)
        return null;
    const updated = {
        ...user,
        ...updates,
        id: user.id, // Don't allow ID change
        createdAt: user.createdAt, // Don't allow createdAt change
        updatedAt: new Date(),
    };
    users.set(id, updated);
    if (updates.email) {
        usersByEmail.delete(user.email);
        usersByEmail.set(updated.email, updated);
    }
    return updated;
}
/**
 * Delete user
 */
function deleteUser(id) {
    const user = users.get(id);
    if (!user)
        return false;
    users.delete(id);
    usersByEmail.delete(user.email);
    return true;
}
/**
 * Check if email exists
 */
function emailExists(email) {
    return usersByEmail.has(email.toLowerCase());
}
//# sourceMappingURL=database.js.map
export interface User {
    id: string;
    email: string;
    passwordHash: string;
    role: 'admin' | 'user' | 'guest';
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Initialize database with test data
 */
export declare function initializeDatabase(): void;
/**
 * Create a new user
 */
export declare function createUser(email: string, passwordHash: string, role?: 'admin' | 'user' | 'guest'): User;
/**
 * Find user by email
 */
export declare function findUserByEmail(email: string): User | undefined;
/**
 * Find user by ID
 */
export declare function findUserById(id: string): User | undefined;
/**
 * Get all users
 */
export declare function getAllUsers(): User[];
/**
 * Update user
 */
export declare function updateUser(id: string, updates: Partial<User>): User | null;
/**
 * Delete user
 */
export declare function deleteUser(id: string): boolean;
/**
 * Check if email exists
 */
export declare function emailExists(email: string): boolean;
//# sourceMappingURL=database.d.ts.map
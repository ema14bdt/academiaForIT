/**
 * @file Defines the User entity.
 */

export type UserRole = 'admin' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Store hash, not plaintext password
  role: UserRole;
}

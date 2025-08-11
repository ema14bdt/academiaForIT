export type UserRole = 'admin' | 'client';
export interface User {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
}

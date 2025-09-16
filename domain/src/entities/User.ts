export const Role = {
  CLIENT: 'CLIENT',
  PROFESSIONAL: 'PROFESSIONAL',
} as const;

export type Role = typeof Role[keyof typeof Role];

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string; // Optional for security reasons on data retrieval
  role: Role;
}

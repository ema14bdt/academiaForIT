export enum Role {
  CLIENT = 'CLIENT',
  PROFESSIONAL = 'PROFESSIONAL',
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Store hash, not plaintext password
  role: Role;
}

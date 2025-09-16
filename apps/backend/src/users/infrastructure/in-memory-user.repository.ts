import { User, Role } from '@domain/entities/User';
import { IUserRepository } from '@domain/use-cases/ports/IUserRepository';

export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [
    // Default admin user
    {
      id: 'admin-1',
      name: 'Administrador',
      email: 'admin@example.com',
      passwordHash: '$2b$12$AP0wHdZ8u/XqXgjznM8xBOV9cZioVPCztuBK6SPMZF02Rpq6eBl8K', // Properly hashed admin123
      role: Role.PROFESSIONAL,
    }
  ];

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  async save(user: User): Promise<void> {
    this.users.push(user);
  }
}


import { User } from '@domain/entities/User';
import { IUserRepository } from '@domain/use-cases/ports/IUserRepository';

export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];

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


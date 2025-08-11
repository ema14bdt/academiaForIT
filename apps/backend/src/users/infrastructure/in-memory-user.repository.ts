import { User } from "@domain/entities/User";
import { IUserRepository } from "@domain/use-cases/ports/IUserRepository";

export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async save(user: User): Promise<void> {
    // In a real app, generate a unique ID here if not provided by domain
    // For now, we'll assume domain provides it or it's hardcoded
    const existingIndex = this.users.findIndex(u => u.id === user.id);
    if (existingIndex > -1) {
      this.users[existingIndex] = user; // Update existing
    } else {
      this.users.push(user); // Add new
    }
  }
}

import { User } from "@domain/entities/User";
import { IPasswordHasher } from "./ports/IPasswordHasher";
import { IUserRepository } from "./ports/IUserRepository";

export interface RegisterClientInput {
  name: string;
  email: string;
  password: string;
}

export class RegisterClient {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher
  ) {}

  async execute(input: RegisterClientInput): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const passwordHash = await this.passwordHasher.hash(input.password);

    const newUser: User = {
      id: 'some-random-id', // Refactor later
      name: input.name,
      email: input.email,
      passwordHash,
      role: 'client',
    };

    await this.userRepository.save(newUser);
  }
}

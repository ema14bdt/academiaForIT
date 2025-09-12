import { Role, User } from "@domain/entities/User";
import { IUserRepository } from "./ports/IUserRepository";
import { EmailAlreadyInUseError } from "@domain/shared/errors";

export interface RegisterClientInput {
  name: string;
  email: string;
  password: string;
}

export class RegisterClient {
  constructor(
    private readonly userRepository: IUserRepository
  ) {}

  async execute(input: RegisterClientInput): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new EmailAlreadyIn-UseError();
    }

    const newUser: User = {
      id: 'some-random-id', // Refactor later
      name: input.name,
      email: input.email,
      passwordHash: input.password, // Storing plaintext password for now
      role: Role.CLIENT,
    };

    await this.userRepository.save(newUser);
  }
}

import { Role, User } from "@domain/entities/User";
import { IUserRepository } from "./ports/IUserRepository";
import { EmailAlreadyInUseError } from "@domain/shared/errors";
import * as bcrypt from 'bcryptjs';

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
      throw new EmailAlreadyInUseError();
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(input.password, salt);

    const newUser: User = {
      id: crypto.randomUUID(),
      name: input.name,
      email: input.email,
      passwordHash,
      role: Role.CLIENT,
    };

    await this.userRepository.save(newUser);
  }
}

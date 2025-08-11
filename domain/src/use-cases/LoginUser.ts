import { User } from "@domain/entities/User";
import { IUserRepository } from "./ports/IUserRepository";

export interface LoginUserInput {
  email: string;
  password: string;
}

export type LoginUserOutput = Omit<User, 'passwordHash'>;

export class LoginUser {
  constructor(
    private readonly userRepository: IUserRepository
  ) {}

  async execute(input: LoginUserInput): Promise<LoginUserOutput> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Temporarily compare plaintext passwords
    if (input.password !== user.passwordHash) {
      throw new Error('Invalid credentials');
    }

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

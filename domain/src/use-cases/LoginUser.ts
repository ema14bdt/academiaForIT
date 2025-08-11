import { User } from "@domain/entities/User";
import { IPasswordHasher } from "./ports/IPasswordHasher";
import { IUserRepository } from "./ports/IUserRepository";

export interface LoginUserInput {
  email: string;
  password: string;
}

export type LoginUserOutput = Omit<User, 'passwordHash'>;

export class LoginUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher
  ) {}

  async execute(input: LoginUserInput): Promise<LoginUserOutput> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordCorrect = await this.passwordHasher.compare(
      input.password,
      user.passwordHash
    );
    if (!isPasswordCorrect) {
      throw new Error('Invalid credentials');
    }

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

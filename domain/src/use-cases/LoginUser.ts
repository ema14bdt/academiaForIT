import { User } from "@domain/entities/User";
import { IUserRepository } from "./ports/IUserRepository";
import { InvalidCredentialsError } from "@domain/shared/errors";
import * as bcrypt from 'bcryptjs';

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
    if (!user || !user.passwordHash) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

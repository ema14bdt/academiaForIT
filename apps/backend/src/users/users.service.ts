import { Injectable } from '@nestjs/common';
import { RegisterClient, RegisterClientInput } from '@domain/use-cases/RegisterClient';
import { LoginUser, LoginUserInput, LoginUserOutput } from '@domain/use-cases/LoginUser';

@Injectable()
export class UsersService {
  constructor(
    private readonly registerClientUseCase: RegisterClient,
    private readonly loginUserUseCase: LoginUser
  ) {}

  async register(input: RegisterClientInput): Promise<void> {
    await this.registerClientUseCase.execute(input);
  }

  async login(input: LoginUserInput): Promise<LoginUserOutput> {
    return this.loginUserUseCase.execute(input);
  }
}

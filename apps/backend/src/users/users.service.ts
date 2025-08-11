import { Injectable } from '@nestjs/common';
import { RegisterClient, RegisterClientInput } from '@domain/use-cases/RegisterClient';

@Injectable()
export class UsersService {
  constructor(private readonly registerClientUseCase: RegisterClient) {}

  async register(input: RegisterClientInput): Promise<void> {
    await this.registerClientUseCase.execute(input);
  }
}

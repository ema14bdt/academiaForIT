import { Inject, Injectable } from '@nestjs/common';
import {
  RegisterClient,
  RegisterClientInput,
} from '@domain/use-cases/RegisterClient';
import { IUserRepository } from '@domain/use-cases/ports/IUserRepository';
import { User } from '@domain/entities/User';

@Injectable()
export class UsersService {
  constructor(
    private readonly registerClientUseCase: RegisterClient,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async register(input: RegisterClientInput): Promise<void> {
    await this.registerClientUseCase.execute(input);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
}

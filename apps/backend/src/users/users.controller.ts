import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import type { RegisterClientInput } from '@domain/use-cases/RegisterClient';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() input: RegisterClientInput): Promise<void> {
    await this.usersService.register(input);
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterClientDto } from './dto/register-client.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() input: RegisterClientDto): Promise<void> {
    await this.usersService.register(input);
  }
}

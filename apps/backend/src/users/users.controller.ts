import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterClientDto } from './dto/register-client.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserOutputDto } from './dto/login-user-output.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() input: RegisterClientDto): Promise<void> {
    await this.usersService.register(input);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() input: LoginUserDto): Promise<LoginUserOutputDto> {
    return this.usersService.login(input);
  }
}

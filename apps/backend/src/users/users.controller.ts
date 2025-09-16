import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { RegisterClientDto } from './dto/register-client.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() input: RegisterClientDto) {
    await this.usersService.register(input);
    
    // Auto-login after registration
    return this.authService.login({
      email: input.email,
      password: input.password,
    });
  }
}

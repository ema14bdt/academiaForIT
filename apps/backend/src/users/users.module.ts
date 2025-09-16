import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { InMemoryUserRepository } from './infrastructure/in-memory-user.repository';
import { IUserRepository } from '@domain/use-cases/ports/IUserRepository';
import { RegisterClient } from '@domain/use-cases/RegisterClient';
import { LoginUser } from '@domain/use-cases/LoginUser';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'IUserRepository',
      useClass: InMemoryUserRepository,
    },
    {
      provide: RegisterClient,
      useFactory: (userRepo: IUserRepository) => {
        return new RegisterClient(userRepo);
      },
      inject: ['IUserRepository'],
    },
    {
      provide: LoginUser,
      useFactory: (userRepo: IUserRepository) => {
        return new LoginUser(userRepo);
      },
      inject: ['IUserRepository'],
    },
  ],
  exports: [UsersService, RegisterClient, LoginUser],
})
export class UsersModule {}

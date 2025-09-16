import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AvailabilityModule } from './availability/availability.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [UsersModule, AuthModule, AppointmentsModule, AvailabilityModule, ServicesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

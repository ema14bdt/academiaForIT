import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AvailabilityModule } from './availability/availability.module';
import { AppointmentsModule } from './appointments/appointments.module';

@Module({
  imports: [UsersModule, AvailabilityModule, AppointmentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

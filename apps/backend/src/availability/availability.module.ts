import { Module } from '@nestjs/common';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';
import { ViewAvailableSlots } from '@domain/use-cases/ViewAvailableSlots';
import { CreateAvailability } from '@domain/use-cases/CreateAvailability';
import { IAvailabilityRepository } from '@domain/use-cases/ports/IAvailabilityRepository';
import { IAppointmentRepository } from '@domain/use-cases/ports/IAppointmentRepository';
import { IUserRepository } from '@domain/use-cases/ports/IUserRepository';
import { InMemoryAvailabilityRepository } from '../common/infrastructure/in-memory-availability.repository';
import { InMemoryAppointmentRepository } from '../common/infrastructure/in-memory-appointment.repository';
import { InMemoryUserRepository } from '../users/infrastructure/in-memory-user.repository';

@Module({
  controllers: [AvailabilityController],
  providers: [
    AvailabilityService,
    {
      provide: 'IAvailabilityRepository',
      useClass: InMemoryAvailabilityRepository,
    },
    {
      provide: 'IAppointmentRepository',
      useClass: InMemoryAppointmentRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: InMemoryUserRepository,
    },
    {
      provide: ViewAvailableSlots,
      useFactory: (
        availRepo: IAvailabilityRepository,
        apptRepo: IAppointmentRepository,
      ) => {
        return new ViewAvailableSlots(availRepo, apptRepo);
      },
      inject: ['IAvailabilityRepository', 'IAppointmentRepository'],
    },
    {
      provide: CreateAvailability,
      useFactory: (
        availRepo: IAvailabilityRepository,
        userRepo: IUserRepository,
      ) => {
        return new CreateAvailability(availRepo, userRepo);
      },
      inject: ['IAvailabilityRepository', 'IUserRepository'],
    },
  ],
  exports: [AvailabilityService, ViewAvailableSlots, CreateAvailability],
})
export class AvailabilityModule {}

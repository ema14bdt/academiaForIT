import { Module } from '@nestjs/common';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';
import { ViewAvailableSlots } from '@domain/use-cases/ViewAvailableSlots';
import { IAvailabilityRepository } from '@domain/use-cases/ports/IAvailabilityRepository';
import { IAppointmentRepository } from '@domain/use-cases/ports/IAppointmentRepository';
import { InMemoryAvailabilityRepository } from '../common/infrastructure/in-memory-availability.repository';
import { InMemoryAppointmentRepository } from '../common/infrastructure/in-memory-appointment.repository';

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
      provide: ViewAvailableSlots,
      useFactory: (availRepo: IAvailabilityRepository, apptRepo: IAppointmentRepository) => {
        return new ViewAvailableSlots(availRepo, apptRepo);
      },
      inject: ['IAvailabilityRepository', 'IAppointmentRepository'],
    },
  ],
  exports: [AvailabilityService, ViewAvailableSlots],
})
export class AvailabilityModule {}

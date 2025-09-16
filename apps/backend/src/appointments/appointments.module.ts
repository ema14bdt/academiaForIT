import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { CancelAppointment } from '@domain/use-cases/CancelAppointment';
import { BookAppointment } from '@domain/use-cases/BookAppointment';
import { GetAppointmentsByUserId } from '@domain/use-cases/GetAppointmentsByUserId';
import { IAppointmentRepository } from '@domain/use-cases/ports/IAppointmentRepository';
import { InMemoryAppointmentRepository } from '../common/infrastructure/in-memory-appointment.repository';
import { IServiceRepository } from '@domain/use-cases/ports/IServiceRepository';
import { InMemoryServiceRepository } from '../common/infrastructure/in-memory-service.repository';
import { IAvailabilityRepository } from '@domain/use-cases/ports/IAvailabilityRepository';
import { InMemoryAvailabilityRepository } from '../common/infrastructure/in-memory-availability.repository';

@Module({
  controllers: [AppointmentsController],
  providers: [
    AppointmentsService,
    {
      provide: 'IAppointmentRepository',
      useClass: InMemoryAppointmentRepository,
    },
    {
      provide: 'IServiceRepository',
      useClass: InMemoryServiceRepository,
    },
    {
      provide: 'IAvailabilityRepository',
      useClass: InMemoryAvailabilityRepository,
    },
    {
      provide: CancelAppointment,
      useFactory: (apptRepo: IAppointmentRepository) => {
        return new CancelAppointment(apptRepo);
      },
      inject: ['IAppointmentRepository'],
    },
    {
      provide: BookAppointment,
      useFactory: (
        apptRepo: IAppointmentRepository,
        availabilityRepo: IAvailabilityRepository,
        serviceRepo: IServiceRepository
      ) => {
        return new BookAppointment(apptRepo, availabilityRepo, serviceRepo);
      },
      inject: ['IAppointmentRepository', 'IAvailabilityRepository', 'IServiceRepository'],
    },
    {
      provide: GetAppointmentsByUserId,
      useFactory: (apptRepo: IAppointmentRepository) => {
        return new GetAppointmentsByUserId(apptRepo);
      },
      inject: ['IAppointmentRepository'],
    },
  ],
  exports: [AppointmentsService, CancelAppointment, BookAppointment, GetAppointmentsByUserId],
})
export class AppointmentsModule {}

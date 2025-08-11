import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { CancelAppointment } from '@domain/use-cases/CancelAppointment';
import { IAppointmentRepository } from '@domain/use-cases/ports/IAppointmentRepository';
import { InMemoryAppointmentRepository } from '../common/infrastructure/in-memory-appointment.repository';
import { IServiceRepository } from '@domain/use-cases/ports/IServiceRepository';
import { InMemoryServiceRepository } from '../common/infrastructure/in-memory-service.repository';

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
      provide: CancelAppointment,
      useFactory: (apptRepo: IAppointmentRepository) => {
        return new CancelAppointment(apptRepo);
      },
      inject: ['IAppointmentRepository'],
    },
  ],
  exports: [AppointmentsService, CancelAppointment],
})
export class AppointmentsModule {}

import { IAppointmentRepository } from './ports/IAppointmentRepository';
import { AppointmentAlreadyCancelledError, AppointmentNotFoundError, UnauthorizedCancellationError } from '@domain/shared/errors';

export interface CancelAppointmentInput {
  appointmentId: string;
  cancellingUserId: string | null; // Null for admin, string for client
}

export class CancelAppointment {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(input: CancelAppointmentInput): Promise<void> {
    const appointment = await this.appointmentRepository.findById(input.appointmentId);

    if (!appointment) {
      throw new AppointmentNotFoundError();
    }

    if (appointment.status === 'cancelled') {
      throw new AppointmentAlreadyCancelledError();
    }

    const isClientCancellation = input.cancellingUserId !== null;
    if (isClientCancellation && appointment.clientId !== input.cancellingUserId) {
      throw new UnauthorizedCancellationError();
    }

    appointment.status = 'cancelled';
    await this.appointmentRepository.update(appointment);
  }
}

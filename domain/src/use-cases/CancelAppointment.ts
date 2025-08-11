import { IAppointmentRepository } from './ports/IAppointmentRepository';
import { AppointmentAlreadyCancelledError, AppointmentNotFoundError, UnauthorizedCancellationError } from '@domain/shared/errors';

export interface CancelAppointmentInput {
  appointmentId: string;
  cancellingUserId: string | null; // null for admin, string for client
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

    // If a user ID is provided, check if they own the appointment
    if (input.cancellingUserId !== null && appointment.clientId !== input.cancellingUserId) {
      throw new UnauthorizedCancellationError();
    }

    appointment.status = 'cancelled';
    await this.appointmentRepository.update(appointment);
  }
}

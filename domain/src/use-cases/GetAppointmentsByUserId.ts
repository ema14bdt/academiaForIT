import { Appointment } from '@domain/entities/Appointment';
import { IAppointmentRepository } from './ports/IAppointmentRepository';

export interface GetAppointmentsByUserIdInput {
  userId: string;
}

export class GetAppointmentsByUserId {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(input: GetAppointmentsByUserIdInput): Promise<Appointment[]> {
    return await this.appointmentRepository.findByUserId(input.userId);
  }
}

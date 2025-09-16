import { Injectable } from '@nestjs/common';
import {
  CancelAppointment,
  CancelAppointmentInput,
} from '@domain/use-cases/CancelAppointment';
import {
  BookAppointment,
  BookAppointmentInput,
} from '@domain/use-cases/BookAppointment';
import {
  GetAppointmentsByUserId,
  GetAppointmentsByUserIdInput,
} from '@domain/use-cases/GetAppointmentsByUserId';
import { Appointment } from '@domain/entities/Appointment';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly cancelAppointmentUseCase: CancelAppointment,
    private readonly bookAppointmentUseCase: BookAppointment,
    private readonly getAppointmentsByUserIdUseCase: GetAppointmentsByUserId,
  ) {}

  async cancel(input: CancelAppointmentInput): Promise<void> {
    await this.cancelAppointmentUseCase.execute(input);
  }

  async book(input: BookAppointmentInput): Promise<void> {
    await this.bookAppointmentUseCase.execute(input);
  }

  async getAppointmentsByUserId(userId: string): Promise<Appointment[]> {
    return await this.getAppointmentsByUserIdUseCase.execute({ userId });
  }
}

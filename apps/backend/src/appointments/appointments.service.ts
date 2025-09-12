import { Injectable } from '@nestjs/common';
import {
  CancelAppointment,
  CancelAppointmentInput,
} from '@domain/use-cases/CancelAppointment';
import {
  BookAppointment,
  BookAppointmentInput,
} from '@domain/use-cases/BookAppointment';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly cancelAppointmentUseCase: CancelAppointment,
    private readonly bookAppointmentUseCase: BookAppointment,
  ) {}

  async cancel(input: CancelAppointmentInput): Promise<void> {
    await this.cancelAppointmentUseCase.execute(input);
  }

  async book(input: BookAppointmentInput): Promise<void> {
    await this.bookAppointmentUseCase.execute(input);
  }
}

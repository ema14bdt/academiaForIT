import { Appointment } from '@domain/entities/Appointment';
import { IAppointmentRepository } from '@domain/use-cases/ports/IAppointmentRepository';

export class InMemoryAppointmentRepository implements IAppointmentRepository {
  private appointments: Appointment[] = [];

  async findById(id: string): Promise<Appointment | null> {
    return this.appointments.find((appt) => appt.id === id) || null;
  }

  async findManyByDateRange(from: Date, to: Date): Promise<Appointment[]> {
    return this.appointments.filter(
      (appt) => appt.startTime < to && appt.endTime > from,
    );
  }

  async findByUserId(userId: string): Promise<Appointment[]> {
    return this.appointments.filter((appt) => appt.clientId === userId);
  }

  async save(appointment: Appointment): Promise<void> {
    const existingIndex = this.appointments.findIndex(
      (appt) => appt.id === appointment.id,
    );
    if (existingIndex > -1) {
      this.appointments[existingIndex] = appointment; // Update existing
    } else {
      this.appointments.push(appointment);
    }
  }

  async update(appointment: Appointment): Promise<void> {
    const index = this.appointments.findIndex(
      (appt) => appt.id === appointment.id,
    );
    if (index > -1) {
      this.appointments[index] = appointment;
    }
  }
}

import { Appointment } from "@domain/entities/Appointment";

export interface IAppointmentRepository {
  findById(id: string): Promise<Appointment | null>;
  findManyByDateRange(from: Date, to: Date): Promise<Appointment[]>;
  save(appointment: Appointment): Promise<void>;
  update(appointment: Appointment): Promise<void>;
}

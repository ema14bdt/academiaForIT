import { Appointment } from "@domain/entities/Appointment";

export interface IAppointmentRepository {
  findManyByDateRange(from: Date, to: Date): Promise<Appointment[]>;
  // save(appointment: Appointment): Promise<void>; // Lo añadiremos en el caso de uso BookAppointment
}

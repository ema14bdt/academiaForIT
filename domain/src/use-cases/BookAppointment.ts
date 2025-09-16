import { Appointment } from "@domain/entities/Appointment";
import { IAppointmentRepository } from "./ports/IAppointmentRepository";
import { IAvailabilityRepository } from "./ports/IAvailabilityRepository";
import { IServiceRepository } from "./ports/IServiceRepository";

export interface BookAppointmentInput {
  clientId: string;
  serviceId: string;
  startTime: Date;
}

export class BookAppointment {
  constructor(
    private readonly appointmentRepo: IAppointmentRepository,
    private readonly availabilityRepo: IAvailabilityRepository,
    private readonly serviceRepo: IServiceRepository
  ) {}

  async execute(input: BookAppointmentInput): Promise<void> {
    const service = await this.serviceRepo.findById(input.serviceId);
    if (!service) {
      throw new Error('Service not found');
    }

    const endTime = new Date(input.startTime.getTime() + service.duration * 60000);

    const [availabilities, conflictingAppointments] = await Promise.all([
      this.availabilityRepo.findManyByDateRange(input.startTime, endTime),
      this.appointmentRepo.findManyByDateRange(input.startTime, endTime),
    ]);

    const isAvailable = availabilities.some(avail => 
      input.startTime >= avail.startTime && endTime <= avail.endTime
    );
    if (!isAvailable) {
      throw new Error('Time slot is not available');
    }

    if (conflictingAppointments.length > 0) {
      throw new Error('Time slot is not available');
    }

    const newAppointment: Appointment = {
      id: crypto.randomUUID(),
      clientId: input.clientId,
      serviceId: input.serviceId,
      startTime: input.startTime,
      endTime,
      status: 'confirmed',
    };

    await this.appointmentRepo.save(newAppointment);
  }
}

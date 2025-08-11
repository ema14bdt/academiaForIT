import { IAppointmentRepository } from "./ports/IAppointmentRepository";
import { IAvailabilityRepository } from "./ports/IAvailabilityRepository";

export interface ViewAvailableSlotsInput {
  date: Date;
  serviceDuration: number; // in minutes
}

export interface AvailableSlot {
  startTime: Date;
  endTime: Date;
}

export class ViewAvailableSlots {
  constructor(
    private readonly availabilityRepo: IAvailabilityRepository,
    private readonly appointmentRepo: IAppointmentRepository
  ) {}

  async execute(input: ViewAvailableSlotsInput): Promise<AvailableSlot[]> {
    const startOfDay = new Date(input.date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(input.date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const [availabilities, appointments] = await Promise.all([
      this.availabilityRepo.findManyByDateRange(startOfDay, endOfDay),
      this.appointmentRepo.findManyByDateRange(startOfDay, endOfDay),
    ]);

    const slots: AvailableSlot[] = [];

    for (const availability of availabilities) {
      let currentTime = new Date(availability.startTime);

      while (currentTime < availability.endTime) {
        const slotEndTime = new Date(currentTime.getTime() + input.serviceDuration * 60000);

        if (slotEndTime > availability.endTime) {
          break;
        }

        const isBooked = appointments.some(appointment => 
          currentTime < appointment.endTime && slotEndTime > appointment.startTime
        );

        if (!isBooked) {
          slots.push({ startTime: new Date(currentTime), endTime: slotEndTime });
        }

        currentTime = slotEndTime;
      }
    }

    return slots;
  }
}

import { Availability } from "@domain/entities/Availability";
import { IAvailabilityRepository } from "./ports/IAvailabilityRepository";

// Usamos un DTO (Data Transfer Object) para el input para mayor claridad
export interface CreateAvailabilityInput {
  adminId: string;
  startTime: Date;
  endTime: Date;
}

export class CreateAvailability {
  constructor(private readonly availabilityRepository: IAvailabilityRepository) {}

  async execute(input: CreateAvailabilityInput): Promise<void> {
    const newAvailability: Availability = {
      id: 'some-random-id', // Temporalmente estático para evitar el error de uuid
      adminId: input.adminId,
      startTime: input.startTime,
      endTime: input.endTime,
    };

    await this.availabilityRepository.save(newAvailability);
  }
}
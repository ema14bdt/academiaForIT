import { Availability } from "@domain/entities/Availability";
import { IAvailabilityRepository } from "./ports/IAvailabilityRepository";

export interface CreateAvailabilityInput {
  professionalId: string;
  startTime: Date;
  endTime: Date;
}

export class CreateAvailability {
  constructor(
    private readonly availabilityRepository: IAvailabilityRepository
  ) {}

  async execute(input: CreateAvailabilityInput): Promise<void> {
    const newAvailability: Availability = {
      id: crypto.randomUUID(),
      professionalId: input.professionalId,
      startTime: input.startTime,
      endTime: input.endTime,
    };

    await this.availabilityRepository.save(newAvailability);
  }
}

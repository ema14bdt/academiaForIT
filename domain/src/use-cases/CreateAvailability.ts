import { Availability } from "@domain/entities/Availability";
import { Role } from "@domain/entities/User";
import { IAvailabilityRepository } from "./ports/IAvailabilityRepository";
import { IUserRepository } from "./ports/IUserRepository";

export interface CreateAvailabilityInput {
  professionalId: string;
  startTime: Date;
  endTime: Date;
}

export class CreateAvailability {
  constructor(
    private readonly availabilityRepository: IAvailabilityRepository,
    private readonly userRepository: IUserRepository
    ) {}

  async execute(input: CreateAvailabilityInput): Promise<void> {
    const performer = await this.userRepository.findById(input.professionalId);

    if (!performer || performer.role !== Role.PROFESSIONAL) {
        throw new Error("Only professionals can create availability.");
    }

    const newAvailability: Availability = {
      id: 'some-random-id', // FIXME: Use a proper UUID generator.
      adminId: input.professionalId,
      startTime: input.startTime,
      endTime: input.endTime,
    };

    await this.availabilityRepository.save(newAvailability);
  }
}
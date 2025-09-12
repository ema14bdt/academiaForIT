import { Injectable } from '@nestjs/common';
import {
  ViewAvailableSlots,
  ViewAvailableSlotsInput,
} from '@domain/use-cases/ViewAvailableSlots';
import { AvailableSlot } from '@domain/use-cases/ViewAvailableSlots'; // Re-exporting domain type
import { CreateAvailability, CreateAvailabilityInput } from '@domain/use-cases/CreateAvailability';

@Injectable()
export class AvailabilityService {
  constructor(
    private readonly viewAvailableSlotsUseCase: ViewAvailableSlots,
    private readonly createAvailabilityUseCase: CreateAvailability,
    ) {}

  async findAvailableSlots(
    input: ViewAvailableSlotsInput,
  ): Promise<AvailableSlot[]> {
    return this.viewAvailableSlotsUseCase.execute(input);
  }

  async createAvailability(input: CreateAvailabilityInput): Promise<void> {
      return this.createAvailabilityUseCase.execute(input);
  }
}

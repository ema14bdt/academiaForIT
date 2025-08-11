import { Injectable } from '@nestjs/common';
import { ViewAvailableSlots, ViewAvailableSlotsInput } from '@domain/use-cases/ViewAvailableSlots';
import { AvailableSlot } from '@domain/use-cases/ViewAvailableSlots'; // Re-exporting domain type

@Injectable()
export class AvailabilityService {
  constructor(private readonly viewAvailableSlotsUseCase: ViewAvailableSlots) {}

  async findAvailableSlots(input: ViewAvailableSlotsInput): Promise<AvailableSlot[]> {
    return this.viewAvailableSlotsUseCase.execute(input);
  }
}

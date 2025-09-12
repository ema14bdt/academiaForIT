import { Availability } from '@domain/entities/Availability';
import { IAvailabilityRepository } from '@domain/use-cases/ports/IAvailabilityRepository';

export class InMemoryAvailabilityRepository implements IAvailabilityRepository {
  private availabilities: Availability[] = [];

  async findById(id: string): Promise<Availability | null> {
    return this.availabilities.find((avail) => avail.id === id) || null;
  }

  async findManyByDateRange(from: Date, to: Date): Promise<Availability[]> {
    return this.availabilities.filter(
      (avail) => avail.startTime < to && avail.endTime > from,
    );
  }

  async save(availability: Availability): Promise<void> {
    const existingIndex = this.availabilities.findIndex(
      (a) => a.id === availability.id,
    );
    if (existingIndex > -1) {
      this.availabilities[existingIndex] = availability; // Update existing
    } else {
      this.availabilities.push(availability); // Add new
    }
  }

  async update(availability: Availability): Promise<void> {
    const index = this.availabilities.findIndex(
      (a) => a.id === availability.id,
    );
    if (index > -1) {
      this.availabilities[index] = availability;
    }
  }
}

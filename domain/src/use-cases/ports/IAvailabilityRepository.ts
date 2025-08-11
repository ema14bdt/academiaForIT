import { Availability } from "@domain/entities/Availability";

export interface IAvailabilityRepository {
  findManyByDateRange(from: Date, to: Date): Promise<Availability[]>;
  save(availability: Availability): Promise<void>;
}

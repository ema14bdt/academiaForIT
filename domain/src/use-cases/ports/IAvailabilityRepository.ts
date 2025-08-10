import { Availability } from "@domain/entities/Availability";

export interface IAvailabilityRepository {
  save(availability: Availability): Promise<void>;
}

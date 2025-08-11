import { Service } from "@domain/entities/Service";

export interface IServiceRepository {
  findById(id: string): Promise<Service | null>;
}

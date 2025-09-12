import { Service } from '@domain/entities/Service';
import { IServiceRepository } from '@domain/use-cases/ports/IServiceRepository';

export class InMemoryServiceRepository implements IServiceRepository {
  private services: Service[] = [
    {
      id: 'service-1',
      name: 'Manicura Express',
      description: 'Manicura rápida',
      duration: 30,
    },
    {
      id: 'service-2',
      name: 'Manicura Completa',
      description: 'Manicura con esmaltado',
      duration: 60,
    },
    {
      id: 'service-3',
      name: 'Pedicura Premium',
      description: 'Pedicura completa con masaje',
      duration: 90,
    },
  ];

  async findById(id: string): Promise<Service | null> {
    return this.services.find((service) => service.id === id) || null;
  }
}

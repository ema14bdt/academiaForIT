import { Service } from '@domain/entities/Service';
import { IServiceRepository } from '@domain/use-cases/ports/IServiceRepository';

export class InMemoryServiceRepository implements IServiceRepository {
  private services: Service[] = [
    {
      id: 'service-1',
      name: 'Consulta',
      description: 'Consulta profesional',
      duration: 30,
      price: 50,
    },
    {
      id: 'service-2',
      name: 'Terapia',
      description: 'Sesión de terapia',
      duration: 60,
      price: 100,
    },
    {
      id: 'service-3',
      name: 'Evaluación',
      description: 'Evaluación completa',
      duration: 90,
      price: 150,
    },
  ];

  async findById(id: string): Promise<Service | null> {
    return this.services.find((service) => service.id === id) || null;
  }
}

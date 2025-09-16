import { Injectable } from '@nestjs/common';

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
}

@Injectable()
export class ServicesService {
  private services: Service[] = [
    {
      id: '1',
      name: 'Consulta General',
      description: 'Consulta médica general',
      duration: 30,
      price: 5000,
    },
    {
      id: '2',
      name: 'Consulta Especializada',
      description: 'Consulta con especialista',
      duration: 45,
      price: 8000,
    },
    {
      id: '3',
      name: 'Chequeo Completo',
      description: 'Examen médico completo',
      duration: 60,
      price: 12000,
    },
    {
      id: '4',
      name: 'Consulta de Seguimiento',
      description: 'Consulta de control y seguimiento',
      duration: 20,
      price: 3000,
    },
  ];

  async getAllServices(): Promise<Service[]> {
    return this.services;
  }

  async getServiceById(id: string): Promise<Service | null> {
    return this.services.find(service => service.id === id) || null;
  }
}

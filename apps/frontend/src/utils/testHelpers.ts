import type { User, Appointment, Service } from '../types/domain';

// Mock data for testing and development
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'CLIENT'
  },
  {
    id: '2',
    name: 'Dr. Jane Smith',
    email: 'jane@example.com',
    role: 'PROFESSIONAL'
  }
];

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Consulta General',
    description: 'Consulta médica general',
    duration: 30,
    price: 100
  },
  {
    id: '2',
    name: 'Terapia',
    description: 'Sesión de terapia psicológica',
    duration: 60,
    price: 50
  },
  {
    id: '3',
    name: 'Evaluación',
    description: 'Evaluación completa del paciente',
    duration: 90,
    price: 150
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    clientId: '1',
    serviceId: '1',
    startTime: new Date('2024-01-15T10:00:00'),
    endTime: new Date('2024-01-15T11:00:00'),
    status: 'confirmed'
  },
  {
    id: '2',
    clientId: '1',
    serviceId: '2',
    startTime: new Date('2024-01-16T14:00:00'),
    endTime: new Date('2024-01-16T14:30:00'),
    status: 'confirmed'
  },
  {
    id: '3',
    clientId: '1',
    serviceId: '3',
    startTime: new Date('2024-01-10T09:00:00'),
    endTime: new Date('2024-01-10T10:30:00'),
    status: 'cancelled'
  }
];

// Helper functions for testing
export const findUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const findServiceById = (id: string): Service | undefined => {
  return mockServices.find(service => service.id === id);
};

export const getAppointmentsByUserId = (userId: string): Appointment[] => {
  return mockAppointments.filter(appointment => appointment.clientId === userId);
};

export const formatDateTime = (date: Date): string => {
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'confirmed':
      return '#28a745';
    case 'cancelled':
      return '#dc3545';
    case 'pending':
      return '#ffc107';
    default:
      return '#6c757d';
  }
};

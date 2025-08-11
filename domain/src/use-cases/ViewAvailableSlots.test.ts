import { ViewAvailableSlots } from './ViewAvailableSlots';
import { IAvailabilityRepository } from './ports/IAvailabilityRepository';
import { IAppointmentRepository } from './ports/IAppointmentRepository';
import { Availability } from '@domain/entities/Availability';
import { Appointment } from '@domain/entities/Appointment';

// Mocks
const mockAvailabilityRepo: jest.Mocked<IAvailabilityRepository> = {
  findManyByDateRange: jest.fn(),
  save: jest.fn(),
};

const mockAppointmentRepo: jest.Mocked<IAppointmentRepository> = {
  findManyByDateRange: jest.fn(),
  save: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ViewAvailableSlots Use Case', () => {
  it('should return only available slots, excluding booked appointments', async () => {
    // Arrange
    const queryDate = new Date('2025-12-15T00:00:00Z');
    const serviceDuration = 30; // 30 minutes

    const availability: Availability = {
      id: 'avail-1',
      adminId: 'admin-1',
      startTime: new Date('2025-12-15T09:00:00Z'),
      endTime: new Date('2025-12-15T10:30:00Z'),
    };

    const appointment: Appointment = {
      id: 'appt-1',
      clientId: 'client-1',
      serviceId: 'service-1',
      startTime: new Date('2025-12-15T09:30:00Z'),
      endTime: new Date('2025-12-15T10:00:00Z'),
      status: 'confirmed',
    };

    mockAvailabilityRepo.findManyByDateRange.mockResolvedValue([availability]);
    mockAppointmentRepo.findManyByDateRange.mockResolvedValue([appointment]);

    const useCase = new ViewAvailableSlots(mockAvailabilityRepo, mockAppointmentRepo);

    // Act
    const availableSlots = await useCase.execute({ date: queryDate, serviceDuration });

    // Assert
    expect(availableSlots).toHaveLength(2);
    expect(availableSlots).toEqual([
      { startTime: new Date('2025-12-15T09:00:00Z'), endTime: new Date('2025-12-15T09:30:00Z') },
      { startTime: new Date('2025-12-15T10:00:00Z'), endTime: new Date('2025-12-15T10:30:00Z') },
    ]);
  });
});

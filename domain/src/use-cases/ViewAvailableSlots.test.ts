import { ViewAvailableSlots } from './ViewAvailableSlots';
import { IAvailabilityRepository } from './ports/IAvailabilityRepository';
import { IAppointmentRepository } from './ports/IAppointmentRepository';
import { Availability } from '@domain/entities/Availability';
import { Appointment } from '@domain/entities/Appointment';

const mockAvailabilityRepo: jest.Mocked<IAvailabilityRepository> = {
  findManyByDateRange: jest.fn(),
  save: jest.fn(),
};
const mockAppointmentRepo: jest.Mocked<IAppointmentRepository> = {
  findById: jest.fn(),
  findManyByDateRange: jest.fn(),
  findByUserId: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ViewAvailableSlots Use Case', () => {
  const useCase = new ViewAvailableSlots(mockAvailabilityRepo, mockAppointmentRepo);
  const testDate = new Date('2025-12-21T00:00:00Z');

  it('should return available slots based on availability and exclude booked appointments', async () => {
    const availability: Availability = {
      id: 'avail-1',
      professionalId: 'admin-1',
      startTime: new Date('2025-12-21T09:00:00Z'),
      endTime: new Date('2025-12-21T10:00:00Z'),
    };
    const appointment: Appointment = {
      id: 'appt-1',
      clientId: 'client-1',
      serviceId: 'service-1',
      startTime: new Date('2025-12-21T09:00:00Z'),
      endTime: new Date('2025-12-21T09:30:00Z'), // 30 min appointment at the beginning
      status: 'confirmed',
    };

    mockAvailabilityRepo.findManyByDateRange.mockResolvedValue([availability]);
    mockAppointmentRepo.findManyByDateRange.mockResolvedValue([appointment]);

    const availableSlots = await useCase.execute({ date: testDate, serviceDuration: 30 });

    // The slot from 9:30 to 10:00 should be available.
    expect(availableSlots.length).toBe(1);
    expect(availableSlots).toEqual([
      { startTime: new Date('2025-12-21T09:30:00Z'), endTime: new Date('2025-12-21T10:00:00Z') },
    ]);
  });
});
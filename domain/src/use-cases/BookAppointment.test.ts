import { BookAppointment } from './BookAppointment';
import { IAvailabilityRepository } from './ports/IAvailabilityRepository';
import { IAppointmentRepository } from './ports/IAppointmentRepository';
import { IServiceRepository } from './ports/IServiceRepository';
import { Service } from '@domain/entities/Service';
import { Availability } from '@domain/entities/Availability';
import { Appointment } from '@domain/entities/Appointment';

// Mocks
const mockAvailabilityRepo: jest.Mocked<IAvailabilityRepository> = { findManyByDateRange: jest.fn(), save: jest.fn() };
const mockAppointmentRepo: jest.Mocked<IAppointmentRepository> = { findManyByDateRange: jest.fn(), save: jest.fn() };
const mockServiceRepo: jest.Mocked<IServiceRepository> = { findById: jest.fn() };

beforeEach(() => jest.clearAllMocks());

describe('BookAppointment Use Case', () => {
  const service: Service = { id: 'service-1', name: 'Manicura', description: '', duration: 30 };
  const availability: Availability = {
    id: 'avail-1', adminId: 'admin-1',
    startTime: new Date('2025-12-18T09:00:00Z'),
    endTime: new Date('2025-12-18T12:00:00Z'),
  };
  const input = { clientId: 'client-1', serviceId: 'service-1', startTime: new Date('2025-12-18T10:00:00Z') };

  it('should book an appointment successfully', async () => {
    // Arrange
    mockServiceRepo.findById.mockResolvedValue(service);
    mockAvailabilityRepo.findManyByDateRange.mockResolvedValue([availability]);
    mockAppointmentRepo.findManyByDateRange.mockResolvedValue([]); // No conflicting appointments
    const useCase = new BookAppointment(mockAppointmentRepo, mockAvailabilityRepo, mockServiceRepo);

    // Act
    await useCase.execute(input);

    // Assert
    expect(mockAppointmentRepo.save).toHaveBeenCalledWith(expect.objectContaining({
      clientId: input.clientId,
      serviceId: input.serviceId,
      startTime: input.startTime,
      endTime: new Date('2025-12-18T10:30:00Z'),
    }));
  });

  it('should throw an error if service is not found', async () => {
    // Arrange
    mockServiceRepo.findById.mockResolvedValue(null);
    const useCase = new BookAppointment(mockAppointmentRepo, mockAvailabilityRepo, mockServiceRepo);

    // Act & Assert
    await expect(useCase.execute(input)).rejects.toThrow('Service not found');
  });

  it('should throw an error if slot is outside of availability', async () => {
    // Arrange
    mockServiceRepo.findById.mockResolvedValue(service);
    mockAvailabilityRepo.findManyByDateRange.mockResolvedValue([]); // Admin is not available
    const useCase = new BookAppointment(mockAppointmentRepo, mockAvailabilityRepo, mockServiceRepo);

    // Act & Assert
    await expect(useCase.execute(input)).rejects.toThrow('Time slot is not available');
  });

  it('should throw an error if slot is already booked', async () => {
    // Arrange
    const existingAppointment: Appointment = { ...input, id: 'appt-1', endTime: new Date(), status: 'confirmed' };
    mockServiceRepo.findById.mockResolvedValue(service);
    mockAvailabilityRepo.findManyByDateRange.mockResolvedValue([availability]);
    mockAppointmentRepo.findManyByDateRange.mockResolvedValue([existingAppointment]);
    const useCase = new BookAppointment(mockAppointmentRepo, mockAvailabilityRepo, mockServiceRepo);

    // Act & Assert
    await expect(useCase.execute(input)).rejects.toThrow('Time slot is not available');
  });
});

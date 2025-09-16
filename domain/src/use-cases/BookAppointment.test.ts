import { BookAppointment } from './BookAppointment';
import { IAppointmentRepository } from './ports/IAppointmentRepository';
import { IAvailabilityRepository } from './ports/IAvailabilityRepository';
import { IServiceRepository } from './ports/IServiceRepository';
import { Service } from '@domain/entities/Service';
import { Availability } from '@domain/entities/Availability';
import { Appointment } from '@domain/entities/Appointment';

const mockAvailabilityRepo: jest.Mocked<IAvailabilityRepository> = { findManyByDateRange: jest.fn(), save: jest.fn() };
const mockAppointmentRepo: jest.Mocked<IAppointmentRepository> = { findById: jest.fn(), findManyByDateRange: jest.fn(), findByUserId: jest.fn(), save: jest.fn(), update: jest.fn() };
const mockServiceRepo: jest.Mocked<IServiceRepository> = { findById: jest.fn() };


beforeEach(() => jest.clearAllMocks());

describe('BookAppointment Use Case', () => {
  const useCase = new BookAppointment(mockAppointmentRepo, mockAvailabilityRepo, mockServiceRepo);
  const service: Service = { id: 'service-1', name: 'Manicura', description: '', duration: 30, price: 50 };
  const availability: Availability = {
    id: 'avail-1', 
    professionalId: 'admin-1',
    startTime: new Date('2025-12-18T09:00:00Z'),
    endTime: new Date('2025-12-18T12:00:00Z'),
  };
  const input = { clientId: 'client-1', serviceId: 'service-1', startTime: new Date('2025-12-18T10:00:00Z') };

  it('should book an appointment successfully', async () => {
    mockServiceRepo.findById.mockResolvedValue(service);
    mockAvailabilityRepo.findManyByDateRange.mockResolvedValue([availability]);
    mockAppointmentRepo.findManyByDateRange.mockResolvedValue([]);
    jest.spyOn(crypto, 'randomUUID').mockReturnValue('mock-uuid' as any);

    await useCase.execute(input);

    expect(mockAppointmentRepo.save).toHaveBeenCalledWith(expect.objectContaining({
      id: 'mock-uuid',
      clientId: input.clientId,
      serviceId: input.serviceId,
      startTime: input.startTime,
      endTime: new Date('2025-12-18T10:30:00Z'),
      status: 'confirmed',
    }));
  });

  it('should throw an error if service is not found', async () => {
    mockServiceRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow('Service not found');
  });

  it('should throw an error if slot is outside of availability', async () => {
    mockServiceRepo.findById.mockResolvedValue(service);
    mockAvailabilityRepo.findManyByDateRange.mockResolvedValue([]);

    await expect(useCase.execute(input)).rejects.toThrow('Time slot is not available');
  });

  it('should throw an error if slot is already booked', async () => {
    const existingAppointment: Appointment = { ...input, id: 'appt-1', endTime: new Date(), status: 'confirmed' };
    mockServiceRepo.findById.mockResolvedValue(service);
    mockAvailabilityRepo.findManyByDateRange.mockResolvedValue([availability]);
    mockAppointmentRepo.findManyByDateRange.mockResolvedValue([existingAppointment]);

    await expect(useCase.execute(input)).rejects.toThrow('Time slot is not available');
  });
});
import { CreateAvailability } from './CreateAvailability';
import { IAvailabilityRepository } from './ports/IAvailabilityRepository';
import { Availability } from '@domain/entities/Availability';

// Mock del Repositorio
const mockAvailabilityRepository: IAvailabilityRepository = {
  save: jest.fn(),
};

describe('CreateAvailability Use Case', () => {
  it('should create and save an availability slot', async () => {
    // Arrange
    const useCase = new CreateAvailability(mockAvailabilityRepository);
    const availabilityData = {
      adminId: 'admin-123',
      startTime: new Date('2025-12-10T09:00:00Z'),
      endTime: new Date('2025-12-10T17:00:00Z'),
    };

    // Act
    await useCase.execute(availabilityData);

    // Assert
    expect(mockAvailabilityRepository.save).toHaveBeenCalled();
    expect(mockAvailabilityRepository.save).toHaveBeenCalledWith(expect.objectContaining({
      adminId: availabilityData.adminId,
      startTime: availabilityData.startTime,
      endTime: availabilityData.endTime,
    }));
  });
});

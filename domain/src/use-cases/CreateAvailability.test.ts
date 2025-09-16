import { CreateAvailability } from './CreateAvailability';
import { IAvailabilityRepository } from './ports/IAvailabilityRepository';

const mockAvailabilityRepository: jest.Mocked<IAvailabilityRepository> = {
  findManyByDateRange: jest.fn(),
  save: jest.fn(),
};


beforeEach(() => {
  jest.clearAllMocks();
});

describe('CreateAvailability Use Case', () => {
  it('should create and save an availability slot', async () => {
    const useCase = new CreateAvailability(mockAvailabilityRepository);
    const availabilityData = {
      professionalId: 'prof-1',
      startTime: new Date('2025-12-20T09:00:00Z'),
      endTime: new Date('2025-12-20T17:00:00Z'),
    };
    jest.spyOn(crypto, 'randomUUID').mockReturnValue('mock-uuid' as any);

    await useCase.execute(availabilityData);

    expect(mockAvailabilityRepository.save).toHaveBeenCalled();
    expect(mockAvailabilityRepository.save).toHaveBeenCalledWith(expect.objectContaining({
      id: 'mock-uuid',
      professionalId: availabilityData.professionalId,
      startTime: availabilityData.startTime,
      endTime: availabilityData.endTime,
    }));
  });
});
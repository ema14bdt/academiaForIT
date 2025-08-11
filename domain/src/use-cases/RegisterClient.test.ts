import { RegisterClient } from './RegisterClient';
import { IUserRepository } from './ports/IUserRepository';
import { User } from '@domain/entities/User';

// Mocks
const mockUserRepository: jest.Mocked<IUserRepository> = {
  findByEmail: jest.fn(),
  save: jest.fn(),
};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

describe('RegisterClient Use Case', () => {
  it('should register a new client successfully', async () => {
    // Arrange
    mockUserRepository.findByEmail.mockResolvedValue(null); // Email is not taken
    const useCase = new RegisterClient(mockUserRepository);
    const input = { name: 'John Doe', email: 'john.doe@example.com', password: 'password123' };

    // Act
    await useCase.execute(input);

    // Assert
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(mockUserRepository.save).toHaveBeenCalledWith(expect.objectContaining({
      name: input.name,
      email: input.email,
      passwordHash: input.password,
      role: 'client',
    }));
  });

  it('should throw an error if email is already in use', async () => {
    // Arrange
    const existingUser: User = { id: '1', name: 'Jane Doe', email: 'jane.doe@example.com', passwordHash: 'hash', role: 'client' };
    mockUserRepository.findByEmail.mockResolvedValue(existingUser); // Email is taken
    const useCase = new RegisterClient(mockUserRepository);
    const input = { name: 'Jane Doe', email: 'jane.doe@example.com', password: 'password123' };

    // Act & Assert
    await expect(useCase.execute(input)).rejects.toThrow('Email already in use');
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });
});

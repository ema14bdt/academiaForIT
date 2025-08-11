import { LoginUser } from './LoginUser';
import { IUserRepository } from './ports/IUserRepository';
import { IPasswordHasher } from './ports/IPasswordHasher';
import { User } from '@domain/entities/User';

// Mocks
const mockUserRepository: jest.Mocked<IUserRepository> = { findByEmail: jest.fn(), save: jest.fn() };
const mockPasswordHasher: jest.Mocked<IPasswordHasher> = { hash: jest.fn(), compare: jest.fn() };

beforeEach(() => jest.clearAllMocks());

describe('LoginUser Use Case', () => {
  const input = { email: 'test@example.com', password: 'password123' };
  const user: User = { 
    id: 'user-1', 
    name: 'Test User', 
    email: input.email, 
    passwordHash: 'hashed_password', 
    role: 'client' 
  };

  it('should return user data (without hash) on successful login', async () => {
    // Arrange
    mockUserRepository.findByEmail.mockResolvedValue(user);
    mockPasswordHasher.compare.mockResolvedValue(true);
    const useCase = new LoginUser(mockUserRepository, mockPasswordHasher);

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(mockPasswordHasher.compare).toHaveBeenCalledWith(input.password, user.passwordHash);
    expect(result).toEqual({ id: user.id, name: user.name, email: user.email, role: user.role });
  });

  it('should throw an error for a non-existent email', async () => {
    // Arrange
    mockUserRepository.findByEmail.mockResolvedValue(null);
    const useCase = new LoginUser(mockUserRepository, mockPasswordHasher);

    // Act & Assert
    await expect(useCase.execute(input)).rejects.toThrow('Invalid credentials');
  });

  it('should throw an error for an incorrect password', async () => {
    // Arrange
    mockUserRepository.findByEmail.mockResolvedValue(user);
    mockPasswordHasher.compare.mockResolvedValue(false);
    const useCase = new LoginUser(mockUserRepository, mockPasswordHasher);

    // Act & Assert
    await expect(useCase.execute(input)).rejects.toThrow('Invalid credentials');
  });
});

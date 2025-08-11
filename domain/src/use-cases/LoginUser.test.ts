import { LoginUser } from './LoginUser';
import { IUserRepository } from './ports/IUserRepository';
import { User } from '@domain/entities/User';

// Mocks
const mockUserRepository: jest.Mocked<IUserRepository> = { findByEmail: jest.fn(), save: jest.fn() };

beforeEach(() => jest.clearAllMocks());

describe('LoginUser Use Case', () => {
  const input = { email: 'test@example.com', password: 'password123' };
  const user: User = { 
    id: 'user-1', 
    name: 'Test User', 
    email: input.email, 
    passwordHash: input.password, // Expecting plaintext password for now
    role: 'client' 
  };

  it('should return user data (without hash) on successful login', async () => {
    // Arrange
    mockUserRepository.findByEmail.mockResolvedValue(user);
    const useCase = new LoginUser(mockUserRepository);

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(result).toEqual({ id: user.id, name: user.name, email: user.email, role: user.role });
  });

  it('should throw an error for a non-existent email', async () => {
    // Arrange
    mockUserRepository.findByEmail.mockResolvedValue(null);
    const useCase = new LoginUser(mockUserRepository);

    // Act & Assert
    await expect(useCase.execute(input)).rejects.toThrow('Invalid credentials');
  });

  it('should throw an error for an incorrect password', async () => {
    // Arrange
    const userWithDifferentPassword: User = { 
      id: 'user-1', 
      name: 'Test User', 
      email: input.email, 
      passwordHash: 'different_password', 
      role: 'client' 
    };
    mockUserRepository.findByEmail.mockResolvedValue(userWithDifferentPassword);
    const useCase = new LoginUser(mockUserRepository);

    // Act & Assert
    await expect(useCase.execute(input)).rejects.toThrow('Invalid credentials');
  });
});

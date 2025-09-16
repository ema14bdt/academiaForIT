import { LoginUser } from './LoginUser';
import { IUserRepository } from './ports/IUserRepository';
import { User, Role } from '@domain/entities/User';
import * as bcrypt from 'bcryptjs';

const mockUserRepository: jest.Mocked<IUserRepository> = {
  findByEmail: jest.fn(),
  save: jest.fn(),
  findById: jest.fn(),
};

jest.mock('bcryptjs');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('LoginUser Use Case', () => {
  const useCase = new LoginUser(mockUserRepository);
  const password = 'password123';
  const user: User = {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    passwordHash: 'hashed_password',
    role: Role.CLIENT,
  };

  it('should return user data (without hash) on successful login', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(user);
    const compareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
    const input = { email: user.email, password };

    const result = await useCase.execute(input);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(compareSpy).toHaveBeenCalledWith(password, user.passwordHash);
    expect(result).toEqual({ id: user.id, name: user.name, email: user.email, role: user.role });
  });

  it('should throw an error for a non-existent email', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    const input = { email: 'nonexistent@example.com', password };

    await expect(useCase.execute(input)).rejects.toThrow('Invalid credentials');
  });

  it('should throw an error for an incorrect password', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    const input = { email: user.email, password: 'wrong-password' };

    await expect(useCase.execute(input)).rejects.toThrow('Invalid credentials');
    expect(bcrypt.compare).toHaveBeenCalledWith(input.password, user.passwordHash);
  });
});
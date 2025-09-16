import { RegisterClient } from './RegisterClient';
import { IUserRepository } from './ports/IUserRepository';
import { User, Role } from '@domain/entities/User';
import { EmailAlreadyInUseError } from '@domain/shared/errors';
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

describe('RegisterClient Use Case', () => {
  const useCase = new RegisterClient(mockUserRepository);
  const input = { name: 'Jane Doe', email: 'jane.doe@example.com', password: 'password123' };

  it('should register a new client successfully', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    jest.spyOn(crypto, 'randomUUID').mockReturnValue('mock-uuid' as any);
    const hashSpy = jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt' as never);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password' as never);

    await useCase.execute(input);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(hashSpy).toHaveBeenCalledWith(10);
    expect(mockUserRepository.save).toHaveBeenCalledWith(expect.objectContaining({
      id: 'mock-uuid',
      name: input.name,
      email: input.email,
      passwordHash: 'hashed-password',
      role: Role.CLIENT,
    }));
  });

  it('should throw an error if email is already in use', async () => {
    const existingUser: User = { id: '1', name: 'Jane Doe', email: input.email, passwordHash: 'hash', role: Role.CLIENT };
    mockUserRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(useCase.execute(input)).rejects.toThrow(EmailAlreadyInUseError);
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });
});
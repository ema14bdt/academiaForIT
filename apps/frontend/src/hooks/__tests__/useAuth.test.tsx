import { renderHook, act, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { AuthProvider, useAuth } from '../useAuth';
import { apiClient } from '../../services/api/ApiClient';
import { AuthResponse, ApiError } from '../../types/domain';

// Mock del apiClient
jest.mock('../../services/api/ApiClient', () => ({
  apiClient: {
    login: jest.fn(),
    register: jest.fn(),
    setToken: jest.fn(),
    clearToken: jest.fn(),
  },
}));

// Mock de localStorage
const mockLocalStorage = () => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: jest.fn((key: string) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
  };
};

const mockStorage = mockLocalStorage();
Object.defineProperty(window, 'localStorage', {
  value: mockStorage,
});

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('useAuth Hook', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  const mockUser = {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    role: 'CLIENT' as const,
  };

  const mockAuthResponse: AuthResponse = {
    user: mockUser,
    token: 'mock-token-123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockStorage.clear();
  });

  describe('Inicialización', () => {
    it('debería inicializar sin usuario cuando no hay datos en localStorage', async () => {
      mockStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBe(null);
      expect(result.current.error).toBe(null);
    });

    it('debería restaurar usuario desde localStorage al inicializar', async () => {
      mockStorage.getItem.mockImplementation((key) => {
        if (key === 'authToken') return 'stored-token';
        if (key === 'userData') return JSON.stringify(mockUser);
        return null;
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(mockApiClient.setToken).toHaveBeenCalledWith('stored-token');
    });

    it('debería limpiar datos corruptos de localStorage', async () => {
      mockStorage.getItem.mockImplementation((key) => {
        if (key === 'authToken') return 'stored-token';
        if (key === 'userData') return 'invalid-json';
        return null;
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBe(null);
      expect(mockStorage.removeItem).toHaveBeenCalledWith('authToken');
      expect(mockStorage.removeItem).toHaveBeenCalledWith('userData');
    });
  });

  describe('Login', () => {
    it('debería hacer login exitosamente', async () => {
      mockApiClient.login.mockResolvedValue(mockAuthResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const loginCredentials = { email: 'juan@example.com', password: 'password123' };

      await act(async () => {
        await result.current.login(loginCredentials);
      });

      expect(mockApiClient.login).toHaveBeenCalledWith(loginCredentials);
      expect(result.current.user).toEqual(mockUser);
      expect(mockStorage.setItem).toHaveBeenCalledWith('userData', JSON.stringify(mockUser));
      expect(mockStorage.setItem).toHaveBeenCalledWith('authToken', 'mock-token-123');
      expect(mockApiClient.setToken).toHaveBeenCalledWith('mock-token-123');
      expect(result.current.error).toBe(null);
    });

    it('debería manejar errores de login', async () => {
      const apiError: ApiError = {
        message: 'Credenciales inválidas',
        status: 401,
      };
      mockApiClient.login.mockRejectedValue(apiError);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const loginCredentials = { email: 'juan@example.com', password: 'wrongpassword' };

      await expect(
        act(async () => {
          await result.current.login(loginCredentials);
        })
      ).rejects.toThrow();

      expect(result.current.error).toBe('Credenciales inválidas');
      expect(result.current.user).toBe(null);
    });
  });

  describe('Register', () => {
    it('debería registrar usuario exitosamente', async () => {
      mockApiClient.register.mockResolvedValue(mockAuthResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const registerData = {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123',
      };

      await act(async () => {
        await result.current.register(registerData);
      });

      expect(mockApiClient.register).toHaveBeenCalledWith(registerData);
      expect(result.current.user).toEqual(mockUser);
      expect(mockStorage.setItem).toHaveBeenCalledWith('userData', JSON.stringify(mockUser));
      expect(mockStorage.setItem).toHaveBeenCalledWith('authToken', 'mock-token-123');
      expect(mockApiClient.setToken).toHaveBeenCalledWith('mock-token-123');
    });

    it('debería manejar errores de registro', async () => {
      const apiError: ApiError = {
        message: 'El email ya está registrado',
        status: 409,
      };
      mockApiClient.register.mockRejectedValue(apiError);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const registerData = {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123',
      };

      await expect(
        act(async () => {
          await result.current.register(registerData);
        })
      ).rejects.toThrow();

      expect(result.current.error).toBe('El email ya está registrado');
      expect(result.current.user).toBe(null);
    });
  });

  describe('Logout', () => {
    it('debería hacer logout correctamente', async () => {
      // Simular usuario logueado
      mockStorage.getItem.mockImplementation((key) => {
        if (key === 'authToken') return 'stored-token';
        if (key === 'userData') return JSON.stringify(mockUser);
        return null;
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBe(null);
      expect(result.current.error).toBe(null);
      expect(mockApiClient.clearToken).toHaveBeenCalled();
      expect(mockStorage.removeItem).toHaveBeenCalledWith('authToken');
      expect(mockStorage.removeItem).toHaveBeenCalledWith('userData');
    });
  });

  describe('Clear Error', () => {
    it('debería limpiar errores', async () => {
      const apiError: ApiError = {
        message: 'Error de prueba',
        status: 400,
      };
      mockApiClient.login.mockRejectedValue(apiError);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Generar un error
      try {
        await act(async () => {
          await result.current.login({ email: 'test', password: 'test' });
        });
      } catch (e) {
        // Esperamos que falle
      }

      expect(result.current.error).toBe('Error de prueba');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBe(null);
    });
  });

  describe('Error de contexto', () => {
    it('debería lanzar error si se usa fuera del AuthProvider', () => {
      // Suprimir el error de consola para este test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => renderHook(() => useAuth())).toThrow(
        'useAuth must be used within an AuthProvider'
      );

      consoleSpy.mockRestore();
    });
  });
});
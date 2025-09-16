import { ApiClient } from '../ApiClient';
import { 
  LoginDto, 
  RegisterClientDto, 
  BookAppointmentDto, 
  CreateAvailabilityDto,
  AuthResponse,
  Appointment,
  Service,
  Availability,
  ApiError
} from '../../../types/domain';

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

// Mock de fetch
global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('ApiClient', () => {
  let apiClient: ApiClient;
  const baseUrl = 'http://localhost:3000';

  beforeEach(() => {
    jest.clearAllMocks();
    mockStorage.clear();
    apiClient = new ApiClient(baseUrl);
  });

  describe('Inicialización', () => {
    it('debería inicializar con URL base por defecto', () => {
      const client = new ApiClient();
      expect(client).toBeInstanceOf(ApiClient);
    });

    it('debería inicializar con URL base personalizada', () => {
      const customUrl = 'https://api.example.com';
      const client = new ApiClient(customUrl);
      expect(client).toBeInstanceOf(ApiClient);
    });

    it('debería cargar token desde localStorage al inicializar', () => {
      mockStorage.getItem.mockReturnValue('stored-token');
      const client = new ApiClient();
      expect(mockStorage.getItem).toHaveBeenCalledWith('authToken');
    });
  });

  describe('Manejo de tokens', () => {
    it('debería establecer token correctamente', () => {
      const token = 'test-token-123';
      apiClient.setToken(token);
      
      expect(mockStorage.setItem).toHaveBeenCalledWith('authToken', token);
    });

    it('debería limpiar token correctamente', () => {
      apiClient.clearToken();
      
      expect(mockStorage.removeItem).toHaveBeenCalledWith('authToken');
    });
  });

  describe('Método request privado', () => {
    it('debería hacer petición GET exitosa', async () => {
      const mockData = [{ id: '1', name: 'Test Service' }];
      mockFetch.mockResolvedValue(new Response(JSON.stringify(mockData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));

      const result = await apiClient.getServices();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/services',
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      expect(result).toEqual(mockData);
    });

    it('debería incluir Authorization header cuando hay token', async () => {
      apiClient.setToken('test-token');
      mockFetch.mockResolvedValue(new Response(JSON.stringify([]), { status: 200 }));

      await apiClient.getServices();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/services',
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token',
          },
        }
      );
    });

    it('debería manejar respuesta vacía', async () => {
      mockFetch.mockResolvedValue(new Response('', { status: 200 }));

      const result = await apiClient.cancelAppointment('123');

      expect(result).toEqual({});
    });

    it('debería manejar error HTTP con JSON', async () => {
      const errorResponse = { message: 'Not found', error: 'NotFoundError' };
      mockFetch.mockResolvedValue(new Response(JSON.stringify(errorResponse), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      }));

      await expect(apiClient.getServices()).rejects.toEqual({
        message: 'Not found',
        statusCode: 404,
        error: 'NotFoundError',
      });
    });

    it('debería manejar error HTTP sin JSON', async () => {
      mockFetch.mockResolvedValue(new Response('Internal Server Error', { status: 500 }));

      await expect(apiClient.getServices()).rejects.toEqual({
        message: 'Internal Server Error',
        statusCode: 500,
        error: undefined,
      });
    });

    it('debería manejar error de red', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(apiClient.getServices()).rejects.toEqual({
        message: 'Error de conexión. Por favor, verifica tu conexión a internet.',
        statusCode: 0,
      });
    });
  });

  describe('Métodos de autenticación', () => {
    describe('login', () => {
      it('debería hacer login exitosamente', async () => {
        const credentials: LoginDto = { email: 'test@example.com', password: 'password123' };
        const mockResponse: AuthResponse = {
          user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'CLIENT' },
          token: 'jwt-token-123'
        };

        mockFetch.mockResolvedValue(new Response(JSON.stringify(mockResponse), { status: 200 }));

        const result = await apiClient.login(credentials);

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3000/auth/login',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          }
        );
        expect(result).toEqual(mockResponse);
        expect(mockStorage.setItem).toHaveBeenCalledWith('authToken', 'jwt-token-123');
      });

      it('debería manejar error de login', async () => {
        const credentials: LoginDto = { email: 'wrong@example.com', password: 'wrong' };
        const errorResponse = { message: 'Invalid credentials' };
        
        mockFetch.mockResolvedValue(new Response(JSON.stringify(errorResponse), { 
          status: 401 
        }));

        await expect(apiClient.login(credentials)).rejects.toEqual({
          message: 'Invalid credentials',
          statusCode: 401,
          error: undefined,
        });
      });
    });

    describe('register', () => {
      it('debería registrar usuario exitosamente', async () => {
        const userData: RegisterClientDto = {
          name: 'New User',
          email: 'new@example.com',
          password: 'password123'
        };
        const mockResponse: AuthResponse = {
          user: { id: '2', name: 'New User', email: 'new@example.com', role: 'CLIENT' },
          token: 'new-jwt-token-456'
        };

        mockFetch.mockResolvedValue(new Response(JSON.stringify(mockResponse), { status: 201 }));

        const result = await apiClient.register(userData);

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3000/users/register',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          }
        );
        expect(result).toEqual(mockResponse);
        expect(mockStorage.setItem).toHaveBeenCalledWith('authToken', 'new-jwt-token-456');
      });
    });
  });

  describe('Métodos de turnos', () => {
    beforeEach(() => {
      apiClient.setToken('valid-token');
    });

    describe('getAppointments', () => {
      it('debería obtener lista de turnos', async () => {
        const mockAppointments: Appointment[] = [
          {
            id: '1',
            clientId: 'client-1',
            serviceId: 'service-1',
            startTime: new Date('2025-01-15T10:00:00Z'),
            endTime: new Date('2025-01-15T10:30:00Z'),
            status: 'confirmed'
          }
        ];

        mockFetch.mockResolvedValue(new Response(JSON.stringify(mockAppointments), { status: 200 }));

        const result = await apiClient.getAppointments();

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3000/appointments',
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer valid-token',
            },
          }
        );
        expect(result).toEqual(mockAppointments);
      });
    });

    describe('bookAppointment', () => {
      it('debería reservar turno exitosamente', async () => {
        const appointmentData: BookAppointmentDto = {
          serviceId: 'service-1',
          startTime: '2025-01-15T10:00:00Z'
        };
        const mockAppointment: Appointment = {
          id: '1',
          clientId: 'client-1',
          serviceId: 'service-1',
          startTime: new Date('2025-01-15T10:00:00Z'),
          endTime: new Date('2025-01-15T10:30:00Z'),
          status: 'confirmed'
        };

        mockFetch.mockResolvedValue(new Response(JSON.stringify(mockAppointment), { status: 201 }));

        const result = await apiClient.bookAppointment(appointmentData);

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3000/appointments',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer valid-token',
            },
            body: JSON.stringify(appointmentData),
          }
        );
        expect(result).toEqual(mockAppointment);
      });
    });

    describe('cancelAppointment', () => {
      it('debería cancelar turno exitosamente', async () => {
        mockFetch.mockResolvedValue(new Response('', { status: 200 }));

        await apiClient.cancelAppointment('appointment-1');

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3000/appointments/appointment-1/cancel',
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer valid-token',
            },
          }
        );
      });
    });
  });

  describe('Métodos de servicios', () => {
    describe('getServices', () => {
      it('debería obtener lista de servicios', async () => {
        const mockServices: Service[] = [
          {
            id: '1',
            name: 'Consulta General',
            description: 'Consulta médica general',
            duration: 30,
            price: 5000
          },
          {
            id: '2',
            name: 'Consulta Especializada',
            description: 'Consulta con especialista',
            duration: 45,
            price: 8000
          }
        ];

        mockFetch.mockResolvedValue(new Response(JSON.stringify(mockServices), { status: 200 }));

        const result = await apiClient.getServices();

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3000/services',
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        expect(result).toEqual(mockServices);
      });
    });
  });

  describe('Métodos de disponibilidad', () => {
    beforeEach(() => {
      apiClient.setToken('valid-token');
    });

    describe('getAvailableSlots', () => {
      it('debería obtener horarios disponibles', async () => {
        const mockAvailability: Availability[] = [
          {
            id: '1',
            professionalId: 'prof-1',
            startTime: new Date('2025-01-15T09:00:00Z'),
            endTime: new Date('2025-01-15T17:00:00Z')
          }
        ];

        mockFetch.mockResolvedValue(new Response(JSON.stringify(mockAvailability), { status: 200 }));

        const result = await apiClient.getAvailableSlots('2025-01-15');

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3000/availability/available-slots?date=2025-01-15&serviceDuration=30',
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer valid-token',
            },
          }
        );
        expect(result).toEqual(mockAvailability);
      });
    });

    describe('createAvailability', () => {
      it('debería crear disponibilidad exitosamente', async () => {
        const availabilityData: CreateAvailabilityDto = {
          startTime: '2025-01-15T09:00:00Z',
          endTime: '2025-01-15T17:00:00Z'
        };
        const mockAvailability: Availability = {
          id: '1',
          professionalId: 'prof-1',
          startTime: new Date('2025-01-15T09:00:00Z'),
          endTime: new Date('2025-01-15T17:00:00Z')
        };

        mockFetch.mockResolvedValue(new Response(JSON.stringify(mockAvailability), { status: 201 }));

        const result = await apiClient.createAvailability(availabilityData);

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3000/availability',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer valid-token',
            },
            body: JSON.stringify(availabilityData),
          }
        );
        expect(result).toEqual(mockAvailability);
      });
    });
  });

  describe('Casos límite y manejo de errores', () => {
    it('debería manejar respuesta con JSON inválido en error', async () => {
      mockFetch.mockResolvedValue(new Response('Invalid JSON response', { status: 500 }));

      await expect(apiClient.getServices()).rejects.toEqual({
        message: 'Invalid JSON response',
        statusCode: 500,
        error: undefined,
      });
    });

    it('debería manejar respuesta de error vacía', async () => {
      mockFetch.mockResolvedValue(new Response('', { status: 400 }));

      await expect(apiClient.getServices()).rejects.toEqual({
        message: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.',
        statusCode: 400,
        error: undefined,
      });
    });

    it('debería manejar error de ApiError existente', async () => {
      const customError: ApiError = {
        message: 'Custom API Error',
        statusCode: 422,
        error: 'ValidationError'
      };
      
      mockFetch.mockRejectedValue(customError);

      await expect(apiClient.getServices()).rejects.toEqual(customError);
    });
  });
});
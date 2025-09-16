import { 
  User, 
  Appointment, 
  Service, 
  Availability,
  LoginDto, 
  RegisterClientDto, 
  BookAppointmentDto, 
  CreateAvailabilityDto,
  AuthResponse,
  ApiError 
} from '../../types/domain';
import { texts } from '../../constants/es';

// La URL base de la API se puede obtener de una variable de entorno
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';

export interface ApiClientInterface {
  // Autenticación
  login(credentials: LoginDto): Promise<AuthResponse>;
  register(userData: RegisterClientDto): Promise<AuthResponse>;
  
  // Turnos
  getAppointments(): Promise<Appointment[]>;
  bookAppointment(appointmentData: BookAppointmentDto): Promise<Appointment>;
  cancelAppointment(appointmentId: string): Promise<void>;
  
  // Servicios
  getServices(): Promise<Service[]>;
  
  // Disponibilidad
  getAvailableSlots(date: string): Promise<Availability[]>;
  createAvailability(availabilityData: CreateAvailabilityDto): Promise<Availability>;
}

export class ApiClient implements ApiClientInterface {
  private baseUrl: string = API_BASE_URL;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>).Authorization = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      const responseText = await response.text();

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          // La respuesta de error no es JSON, usar texto plano si existe
          errorData = { message: responseText || texts.apiErrors.genericError };
        }
        
        const error: ApiError = {
          message: (errorData as any).message || texts.apiErrors.genericError,
          statusCode: response.status,
          error: (errorData as any).error,
        };
        throw error;
      }

      // Si la respuesta está vacía, devolver un objeto vacío resuelto
      if (responseText.length === 0) {
        return Promise.resolve({} as T);
      }

      return JSON.parse(responseText) as T;
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }
      
      throw {
        message: texts.apiErrors.networkError,
        statusCode: 0,
      } as ApiError;
    }
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Métodos de autenticación
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async register(userData: RegisterClientDto): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  // Métodos de turnos
  async getAppointments(): Promise<Appointment[]> {
    return this.request<Appointment[]>('/appointments');
  }

  async bookAppointment(appointmentData: BookAppointmentDto): Promise<Appointment> {
    return this.request<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  async cancelAppointment(appointmentId: string): Promise<void> {
    await this.request(`/appointments/${appointmentId}/cancel`, {
      method: 'PATCH',
    });
  }

  // Métodos de servicios
  async getServices(): Promise<Service[]> {
    return this.request<Service[]>('/services');
  }

  // Métodos de disponibilidad
  async getAvailableSlots(date: string): Promise<Availability[]> {
    return this.request<Availability[]>(`/availability/available-slots?date=${date}&serviceDuration=30`);
  }

  async createAvailability(availabilityData: CreateAvailabilityDto): Promise<Availability> {
    return this.request<Availability>('/availability', {
      method: 'POST',
      body: JSON.stringify(availabilityData),
    });
  }
}

// Instancia Singleton
export const apiClient = new ApiClient();

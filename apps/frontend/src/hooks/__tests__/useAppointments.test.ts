import { renderHook, act, waitFor } from '@testing-library/react';
import { useAppointments } from '../useAppointments';
import { apiClient } from '../../services/api/ApiClient';
import { Appointment, Service, ApiError } from '../../types/domain';

// Mock del apiClient
jest.mock('../../services/api/ApiClient', () => ({
  apiClient: {
    getAppointments: jest.fn(),
    getServices: jest.fn(),
    cancelAppointment: jest.fn(),
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('useAppointments Hook', () => {
  const mockServices: Service[] = [
    {
      id: '1',
      name: 'Consulta General',
      description: 'Consulta médica general',
      duration: 30,
      price: 5000,
    },
    {
      id: '2',
      name: 'Consulta Especializada',
      description: 'Consulta con especialista',
      duration: 45,
      price: 8000,
    },
  ];

  const mockAppointments: Appointment[] = [
    {
      id: 'appt-1',
      clientId: 'client-1',
      serviceId: '1',
      startTime: new Date('2025-01-15T10:00:00Z'),
      endTime: new Date('2025-01-15T10:30:00Z'),
      status: 'confirmed',
    },
    {
      id: 'appt-2',
      clientId: 'client-1',
      serviceId: '2',
      startTime: new Date('2025-01-16T14:00:00Z'),
      endTime: new Date('2025-01-16T14:45:00Z'),
      status: 'confirmed',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Inicialización y carga de datos', () => {
    it('debería cargar turnos y servicios exitosamente', async () => {
      mockApiClient.getAppointments.mockResolvedValue(mockAppointments);
      mockApiClient.getServices.mockResolvedValue(mockServices);

      const { result } = renderHook(() => useAppointments());

      // Inicialmente debería estar cargando
      expect(result.current.loading).toBe(true);
      expect(result.current.appointments).toEqual([]);
      expect(result.current.error).toBe(null);

      // Esperar a que termine la carga
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Verificar que los datos se cargaron correctamente
      expect(result.current.appointments).toHaveLength(2);
      expect(result.current.appointments[0]).toEqual({
        ...mockAppointments[0],
        service: mockServices[0],
      });
      expect(result.current.appointments[1]).toEqual({
        ...mockAppointments[1],
        service: mockServices[1],
      });
      expect(result.current.error).toBe(null);

      // Verificar que se llamaron las APIs correctas
      expect(mockApiClient.getAppointments).toHaveBeenCalledTimes(1);
      expect(mockApiClient.getServices).toHaveBeenCalledTimes(1);
    });

    it('debería enriquecer turnos sin servicio cuando el servicio no existe', async () => {
      const appointmentsWithMissingService: Appointment[] = [
        {
          id: 'appt-1',
          clientId: 'client-1',
          serviceId: 'non-existent-service',
          startTime: new Date('2025-01-15T10:00:00Z'),
          endTime: new Date('2025-01-15T10:30:00Z'),
          status: 'confirmed',
        },
      ];

      mockApiClient.getAppointments.mockResolvedValue(appointmentsWithMissingService);
      mockApiClient.getServices.mockResolvedValue(mockServices);

      const { result } = renderHook(() => useAppointments());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.appointments).toHaveLength(1);
      expect(result.current.appointments[0]).toEqual({
        ...appointmentsWithMissingService[0],
        service: undefined,
      });
    });

    it('debería manejar error al cargar turnos', async () => {
      const apiError: ApiError = {
        message: 'Error al obtener turnos',
        status: 500,
      };
      mockApiClient.getAppointments.mockRejectedValue(apiError);
      mockApiClient.getServices.mockResolvedValue(mockServices);

      const { result } = renderHook(() => useAppointments());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Error al obtener turnos');
      expect(result.current.appointments).toEqual([]);
    });

    it('debería manejar error al cargar servicios', async () => {
      const apiError: ApiError = {
        message: 'Error al obtener servicios',
        status: 500,
      };
      mockApiClient.getAppointments.mockResolvedValue(mockAppointments);
      mockApiClient.getServices.mockRejectedValue(apiError);

      const { result } = renderHook(() => useAppointments());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Error al obtener servicios');
      expect(result.current.appointments).toEqual([]);
    });

    it('debería usar mensaje de error por defecto cuando no hay mensaje específico', async () => {
      const apiError = new Error('Network error');
      mockApiClient.getAppointments.mockRejectedValue(apiError);

      const { result } = renderHook(() => useAppointments());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Error al cargar los turnos');
    });
  });

  describe('Refetch funcionalidad', () => {
    it('debería permitir recargar los datos', async () => {
      mockApiClient.getAppointments.mockResolvedValue(mockAppointments);
      mockApiClient.getServices.mockResolvedValue(mockServices);

      const { result } = renderHook(() => useAppointments());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Limpiar los mocks para verificar la segunda llamada
      jest.clearAllMocks();

      await act(async () => {
        await result.current.refetch();
      });

      expect(mockApiClient.getAppointments).toHaveBeenCalledTimes(1);
      expect(mockApiClient.getServices).toHaveBeenCalledTimes(1);
    });
  });

  describe('Cancelación de turnos', () => {
    it('debería cancelar un turno exitosamente', async () => {
      mockApiClient.getAppointments.mockResolvedValue(mockAppointments);
      mockApiClient.getServices.mockResolvedValue(mockServices);
      mockApiClient.cancelAppointment.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAppointments());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const appointmentToCancel = result.current.appointments[0];
      expect(appointmentToCancel.status).toBe('confirmed');

      await act(async () => {
        await result.current.cancelAppointment('appt-1');
      });

      // Verificar que se llamó la API de cancelación
      expect(mockApiClient.cancelAppointment).toHaveBeenCalledWith('appt-1');

      // Verificar que el estado local se actualizó
      const cancelledAppointment = result.current.appointments.find(a => a.id === 'appt-1');
      expect(cancelledAppointment?.status).toBe('cancelled');

      // Verificar que otros turnos no se afectaron
      const otherAppointment = result.current.appointments.find(a => a.id === 'appt-2');
      expect(otherAppointment?.status).toBe('confirmed');
    });

    it('debería manejar error al cancelar turno', async () => {
      mockApiClient.getAppointments.mockResolvedValue(mockAppointments);
      mockApiClient.getServices.mockResolvedValue(mockServices);

      const cancelError: ApiError = {
        message: 'No se puede cancelar el turno',
        status: 400,
      };
      mockApiClient.cancelAppointment.mockRejectedValue(cancelError);

      const { result } = renderHook(() => useAppointments());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.cancelAppointment('appt-1');
        })
      ).rejects.toThrow();

      // Verificar que se estableció el error
      expect(result.current.error).toBe('No se puede cancelar el turno');

      // Verificar que el estado del turno no cambió
      const appointment = result.current.appointments.find(a => a.id === 'appt-1');
      expect(appointment?.status).toBe('confirmed');
    });

    it('debería usar mensaje de error por defecto al cancelar', async () => {
      mockApiClient.getAppointments.mockResolvedValue(mockAppointments);
      mockApiClient.getServices.mockResolvedValue(mockServices);

      const genericError = new Error('Generic error');
      mockApiClient.cancelAppointment.mockRejectedValue(genericError);

      const { result } = renderHook(() => useAppointments());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.cancelAppointment('appt-1');
        })
      ).rejects.toThrow();

      expect(result.current.error).toBe('Error al cancelar el turno');
    });
  });

  describe('Estados de carga durante operaciones', () => {
    it('debería mostrar loading durante la carga inicial', async () => {
      let resolveAppointments: (value: Appointment[]) => void;
      const appointmentsPromise = new Promise<Appointment[]>((resolve) => {
        resolveAppointments = resolve;
      });

      mockApiClient.getAppointments.mockReturnValue(appointmentsPromise);
      mockApiClient.getServices.mockResolvedValue(mockServices);

      const { result } = renderHook(() => useAppointments());

      // Debería estar cargando
      expect(result.current.loading).toBe(true);

      // Resolver la promesa
      act(() => {
        resolveAppointments!(mockAppointments);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('debería mostrar loading durante refetch', async () => {
      mockApiClient.getAppointments.mockResolvedValue(mockAppointments);
      mockApiClient.getServices.mockResolvedValue(mockServices);

      const { result } = renderHook(() => useAppointments());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Configurar una nueva promesa lenta para el refetch
      let resolveRefetch: (value: Appointment[]) => void;
      const refetchPromise = new Promise<Appointment[]>((resolve) => {
        resolveRefetch = resolve;
      });

      mockApiClient.getAppointments.mockReturnValue(refetchPromise);

      act(() => {
        result.current.refetch();
      });

      // Debería estar cargando durante el refetch
      expect(result.current.loading).toBe(true);

      // Resolver el refetch
      act(() => {
        resolveRefetch!(mockAppointments);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });
});
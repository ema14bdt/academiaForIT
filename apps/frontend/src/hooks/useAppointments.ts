import { useState, useEffect, useCallback } from 'react';
import { Appointment, Service, ApiError } from '../types/domain';
import { apiClient } from '../services/api/ApiClient';

export interface EnrichedAppointment extends Appointment {
  service?: Service;
}

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<EnrichedAppointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener turnos y servicios en paralelo
      const [appointmentsResponse, servicesResponse] = await Promise.all([
        apiClient.getAppointments(),
        apiClient.getServices(),
      ]);

      // Crear un mapa de servicios para una búsqueda eficiente
      const servicesMap = new Map<string, Service>();
      servicesResponse.forEach(service => servicesMap.set(service.id, service));

      // Enriquecer cada turno con la información de su servicio
      const enrichedAppointments = appointmentsResponse.map(appointment => ({
        ...appointment,
        service: servicesMap.get(appointment.serviceId),
      }));

      setAppointments(enrichedAppointments);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al cargar los turnos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const cancelAppointment = useCallback(async (appointmentId: string) => {
    try {
      await apiClient.cancelAppointment(appointmentId);
      // Actualizar el estado local para reflejar la cancelación
      setAppointments(prev =>
        prev.map(appt =>
          appt.id === appointmentId ? { ...appt, status: 'cancelled' } : appt
        )
      );
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al cancelar el turno');
      // Re-lanzar el error por si el componente necesita reaccionar
      throw err;
    }
  }, []);

  return { appointments, loading, error, refetch: fetchAppointments, cancelAppointment };
};

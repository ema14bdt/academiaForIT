import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/api/ApiClient';
import { Card } from '../ui/Card/Card';
import { Button } from '../ui/Button/Button';
import { Appointment, Service } from '../../types/domain';
import './MyAppointments.css';

export const MyAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [appointmentsData, servicesData] = await Promise.all([
        apiClient.getAppointments(),
        apiClient.getServices()
      ]);
      setAppointments(appointmentsData);
      setServices(servicesData);
    } catch (err: unknown) {
      // Error loading appointments
      const error = err as any;
      const errorMessage = error?.response?.data?.message || error?.message || 'Error al cargar tus citas. Por favor, intenta de nuevo.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
      return;
    }

    try {
      await apiClient.cancelAppointment(appointmentId);
      await loadData(); // Reload appointments
    } catch (err) {
      setError('Error al cancelar la cita');
    }
  };

  const servicesMap = services.reduce((acc: Record<string, Service>, s: Service) => {
    acc[s.id] = s;
    return acc;
  }, {} as Record<string, Service>);

  const getServiceInfo = (serviceId: string) => {
    return servicesMap[serviceId];
  };

  const now = new Date();
  const isUpcoming = (startTime: string) => {
    const appointmentDate = new Date(startTime);
    return appointmentDate >= now;
  };

  const upcomingAppointments = appointments.filter((apt: Appointment) => {
    return apt.status === 'confirmed' && isUpcoming(apt.startTime.toString());
  });

  const pastAppointments = appointments.filter((apt: Appointment) => 
    !isUpcoming(apt.startTime.toString()) || apt.status === 'cancelled'
  );

  if (loading) {
    return <div className="my-appointments loading">Cargando tus citas...</div>;
  }

  return (
    <div className="my-appointments">
      <h2>Mis Citas</h2>

      {error && (
        <div className="appointments-error">
          {error}
          <div className="error-actions">
            <Button variant="primary" size="small" onClick={loadData}>
              Reintentar
            </Button>
            <Button variant="secondary" size="small" onClick={() => setError(null)}>
              Cerrar
            </Button>
          </div>
        </div>
      )}

      {/* Upcoming Appointments */}
      <div className="appointments-section">
        <h3>Próximas Citas ({upcomingAppointments.length})</h3>
        
        {upcomingAppointments.length === 0 ? (
          <Card className="no-appointments">
            <p>No tienes citas próximas. ¡Reserva una nueva cita!</p>
          </Card>
        ) : (
          <div className="appointments-list">
            {upcomingAppointments.map((appointment: Appointment) => {
              const service = getServiceInfo(appointment.serviceId);
              return (
                <Card key={appointment.id} className="appointment-card upcoming">
                  <div className="appointment-header">
                    <div className="appointment-date">
                      {new Date(appointment.startTime).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="appointment-time">
                      {new Date(appointment.startTime).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })} - {new Date(appointment.endTime).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  
                  <div className="appointment-details">
                    <h4>{service?.name || 'Servicio desconocido'}</h4>
                    <p>{service?.description}</p>
                    <div className="service-info">
                      <span>Duración: {service?.duration} min</span>
                      <span>Precio: ${service?.price}</span>
                    </div>
                  </div>

                  <div className="appointment-actions">
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleCancelAppointment(appointment.id)}
                    >
                      Cancelar Cita
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Past/Cancelled Appointments */}
      {pastAppointments.length > 0 && (
        <div className="appointments-section">
          <h3>Historial de Citas ({pastAppointments.length})</h3>
          
          <div className="appointments-list">
            {pastAppointments.map((appointment: Appointment) => {
              const service = getServiceInfo(appointment.serviceId);
              const isPast = !isUpcoming(appointment.startTime.toString()) && appointment.status === 'confirmed';
              const isCancelled = appointment.status === 'cancelled';
              
              return (
                <Card key={appointment.id} className={`appointment-card ${isPast ? 'past' : 'cancelled'}`}>
                  <div className="appointment-header">
                    <div className="appointment-date">
                      {new Date(appointment.startTime).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="appointment-time">
                      {new Date(appointment.startTime).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })} - {new Date(appointment.endTime).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className={`appointment-status ${appointment.status}`}>
                      {isCancelled ? 'Cancelada' : 'Completada'}
                    </div>
                  </div>
                  
                  <div className="appointment-details">
                    <h4>{service?.name || 'Servicio desconocido'}</h4>
                    <p>{service?.description}</p>
                    <div className="service-info">
                      <span>Duración: {service?.duration} min</span>
                      <span>Precio: ${service?.price}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

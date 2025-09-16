import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button/Button';
import { Card } from '../ui/Card/Card';
import { apiClient } from '../../services/api/ApiClient';
import { Appointment, Service } from '../../types/domain';
import './BookedAppointments.css';

export const BookedAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appointmentsData, servicesData] = await Promise.all([
        apiClient.getAppointments(),
        apiClient.getServices()
      ]);
      setAppointments(appointmentsData);
      setServices(servicesData);
    } catch (err) {
      setError('Error al cargar las citas');
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

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service?.name || 'Servicio desconocido';
  };

  const getServiceDuration = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service?.duration || 0;
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

  const groupAppointmentsByDate = (appointments: Appointment[]) => {
    const groups: { [key: string]: Appointment[] } = {};
    
    appointments.forEach(appointment => {
      const date = new Date(appointment.startTime).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(appointment);
    });

    // Sort groups by date
    const sortedGroups = Object.keys(groups)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .reduce((acc, key) => {
        acc[key] = groups[key].sort((a, b) => 
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
        return acc;
      }, {} as { [key: string]: Appointment[] });

    return sortedGroups;
  };

  const groupedAppointments = groupAppointmentsByDate(filteredAppointments);

  if (loading) {
    return <div className="booked-appointments loading">Cargando citas...</div>;
  }

  return (
    <div className="booked-appointments">
      <div className="appointments-header">
        <h2>Citas Reservadas</h2>
        <div className="appointments-filters">
          <Button
            variant={filter === 'all' ? 'primary' : 'secondary'}
            size="small"
            onClick={() => setFilter('all')}
          >
            Todas ({appointments.length})
          </Button>
          <Button
            variant={filter === 'confirmed' ? 'primary' : 'secondary'}
            size="small"
            onClick={() => setFilter('confirmed')}
          >
            Confirmadas ({appointments.filter(a => a.status === 'confirmed').length})
          </Button>
          <Button
            variant={filter === 'cancelled' ? 'primary' : 'secondary'}
            size="small"
            onClick={() => setFilter('cancelled')}
          >
            Canceladas ({appointments.filter(a => a.status === 'cancelled').length})
          </Button>
        </div>
      </div>

      {error && (
        <div className="appointments-error">
          {error}
          <Button variant="secondary" size="small" onClick={() => setError(null)}>
            Cerrar
          </Button>
        </div>
      )}

      {Object.keys(groupedAppointments).length === 0 ? (
        <Card className="no-appointments">
          <p>No hay citas {filter === 'all' ? '' : filter === 'confirmed' ? 'confirmadas' : 'canceladas'} para mostrar.</p>
        </Card>
      ) : (
        <div className="appointments-by-date">
          {Object.entries(groupedAppointments).map(([date, dayAppointments]) => (
            <div key={date} className="appointments-day">
              <h3 className="day-header">
                {new Date(date).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              
              <div className="day-appointments">
                {dayAppointments.map(appointment => (
                  <Card key={appointment.id} className="appointment-card">
                    <div className="appointment-header">
                      <div className="appointment-time">
                        {new Date(appointment.startTime).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} - {new Date(appointment.endTime).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className={`appointment-status status-${appointment.status}`}>
                        {appointment.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                      </div>
                    </div>
                    
                    <div className="appointment-details">
                      <p><strong>Servicio:</strong> {getServiceName(appointment.serviceId)}</p>
                      <p><strong>Duración:</strong> {getServiceDuration(appointment.serviceId)} minutos</p>
                      <p><strong>Cliente ID:</strong> {appointment.clientId}</p>
                    </div>

                    {appointment.status === 'confirmed' && (
                      <div className="appointment-actions">
                        <Button
                          variant="danger"
                          size="small"
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          Cancelar Cita
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

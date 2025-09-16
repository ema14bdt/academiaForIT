import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button/Button';
import { Card } from '../ui/Card/Card';
import { apiClient } from '../../services/api/ApiClient';
import { Service } from '../../types/domain';
import './BookingSection.css';

export const BookingSection: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const servicesData = await apiClient.getServices();
      setServices(servicesData);
    } catch (err) {
      setError('Error al cargar los servicios');
    }
  };

  const loadAvailableSlots = async () => {
    if (!selectedDate) return;
    
    try {
      setLoading(true);
      const slots = await apiClient.getAvailableSlots(selectedDate);
      setAvailableSlots(slots);
    } catch (err) {
      setError('Error al cargar los horarios disponibles');
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedService || !selectedSlot) return;

    try {
      setLoading(true);
      const endTime = new Date(selectedSlot.startTime);
      endTime.setMinutes(endTime.getMinutes() + selectedService.duration);

      await apiClient.bookAppointment({
        serviceId: selectedService.id,
        startTime: selectedSlot.startTime,
        endTime: endTime.toISOString(),
      });

      // Reset form
      setSelectedService(null);
      setSelectedDate('');
      setAvailableSlots([]);
      setSelectedSlot(null);
      alert('Turno reservado exitosamente');
    } catch (err) {
      setError('Error al reservar el turno');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-section">
      {error && (
        <div className="booking-error">
          {error}
          <Button variant="secondary" size="small" onClick={() => setError(null)}>
            Cerrar
          </Button>
        </div>
      )}

      <div className="booking-step">
        <h3>1. Selecciona un Servicio</h3>
        <div className="services-grid">
          {services.map(service => (
            <Card
              key={service.id}
              className={`service-card ${selectedService?.id === service.id ? 'selected' : ''}`}
              onClick={() => setSelectedService(service)}
            >
              <h4>{service.name}</h4>
              <p>{service.description}</p>
              <div className="service-details">
                <span>Duración: {service.duration} min</span>
                <span>Precio: ${service.price}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {selectedService && (
        <div className="booking-step">
          <h3>2. Selecciona una Fecha</h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="date-input"
          />
          <Button onClick={loadAvailableSlots} disabled={!selectedDate}>
            Buscar Horarios Disponibles
          </Button>
        </div>
      )}

      {availableSlots.length > 0 && (
        <div className="booking-step">
          <h3>3. Selecciona un Horario</h3>
          <div className="slots-grid">
            {availableSlots.map(slot => (
              <Button
                key={slot.id}
                variant={selectedSlot?.id === slot.id ? 'primary' : 'secondary'}
                onClick={() => setSelectedSlot(slot)}
              >
                {new Date(slot.startTime).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Button>
            ))}
          </div>
        </div>
      )}

      {selectedService && selectedSlot && (
        <div className="booking-step">
          <h3>Confirmar Reserva</h3>
          <div className="booking-summary">
            <p><strong>Servicio:</strong> {selectedService.name}</p>
            <p><strong>Fecha:</strong> {new Date(selectedDate).toLocaleDateString('es-ES')}</p>
            <p><strong>Horario:</strong> {new Date(selectedSlot.startTime).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <p><strong>Duración:</strong> {selectedService.duration} minutos</p>
            <p><strong>Precio:</strong> ${selectedService.price}</p>
          </div>
          <Button
            variant="primary"
            size="large"
            onClick={handleBookAppointment}
            loading={loading}
            disabled={loading}
          >
            Confirmar Reserva
          </Button>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button/Button';
import { Card } from '../ui/Card/Card';
import { apiClient } from '../../services/api/ApiClient';
import { Availability, CreateAvailabilityDto } from '../../types/domain';
import './AvailabilityManagement.css';

export const AvailabilityManagement: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedDate) {
      loadAvailability();
    }
  }, [selectedDate]);

  const loadAvailability = async () => {
    if (!selectedDate) return;

    try {
      setLoading(true);
      const availabilityData = await apiClient.getAvailableSlots(selectedDate);
      setAvailability(availabilityData);
    } catch (err) {
      setError('Error al cargar la disponibilidad');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !startTime || !endTime) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      
      const availabilityData: CreateAvailabilityDto = {
        date: selectedDate,
        startTime: `${selectedDate}T${startTime}:00`,
        endTime: `${selectedDate}T${endTime}:00`,
      };

      await apiClient.createAvailability(availabilityData);
      
      // Reset form
      setStartTime('');
      setEndTime('');
      
      // Reload availability
      await loadAvailability();
      
    } catch (err) {
      setError('Error al crear la disponibilidad');
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="availability-management">
      <h2>Gestión de Disponibilidad</h2>
      
      {error && (
        <div className="availability-error">
          {error}
          <Button variant="secondary" size="small" onClick={() => setError(null)}>
            Cerrar
          </Button>
        </div>
      )}

      <Card className="create-availability-card">
        <h3>Crear Nueva Disponibilidad</h3>
        <form onSubmit={handleCreateAvailability} className="availability-form">
          <div className="form-group">
            <label htmlFor="date">Fecha:</label>
            <input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">Hora de Inicio:</label>
              <select
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              >
                <option value="">Seleccionar hora</option>
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="endTime">Hora de Fin:</label>
              <select
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              >
                <option value="">Seleccionar hora</option>
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading || !selectedDate || !startTime || !endTime}
          >
            Crear Disponibilidad
          </Button>
        </form>
      </Card>

      {selectedDate && (
        <Card className="current-availability-card">
          <h3>Disponibilidad para {new Date(selectedDate).toLocaleDateString('es-ES')}</h3>
          
          {loading ? (
            <p>Cargando disponibilidad...</p>
          ) : availability.length === 0 ? (
            <p>No hay disponibilidad configurada para esta fecha.</p>
          ) : (
            <div className="availability-list">
              {availability.map(slot => (
                <div key={slot.id} className="availability-slot">
                  <span className="slot-time">
                    {new Date(slot.startTime).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })} - {new Date(slot.endTime).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <span className={`slot-status ${slot.isAvailable ? 'available' : 'unavailable'}`}>
                    {slot.isAvailable ? 'Disponible' : 'Ocupado'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

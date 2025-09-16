import React from 'react';
import { Card } from '../../ui/Card/Card';
import { Button } from '../../ui/Button/Button';
import { Appointment, Service, User, AppointmentStatus } from '../../../types/domain';
import { texts } from '../../../constants/es';
import './AppointmentCard.css';

export interface AppointmentCardProps {
  /** Datos del turno */
  appointment: Appointment;
  /** Información del servicio */
  service?: Service;
  /** Información del profesional (para clientes) o cliente (para profesionales) */
  user?: User;
  /** Rol del usuario actual para determinar qué acciones mostrar */
  userRole?: 'client' | 'professional';
  /** Llamado cuando se hace clic en el botón de cancelar */
  onCancel?: (appointmentId: string) => void;
  /** Llamado cuando se hace clic en el botón de reprogramar */
  onReschedule?: (appointmentId: string) => void;
  /** Llamado cuando se hace clic en la tarjeta */
  onClick?: (appointmentId: string) => void;
  /** Estado de carga para las acciones */
  loading?: boolean;
}

/**
 * Componente de tarjeta para mostrar la información de un turno
 */
export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  service,
  user,
  userRole = 'client',
  onCancel,
  onReschedule,
  onClick,
  loading = false,
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(date));
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: AppointmentStatus) => {
    return texts.appointmentCard.status[status] || status;
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(appointment.id);
    }
  };

  const handleReschedule = () => {
    onReschedule?.(appointment.id);
  };

  const handleCancel = () => {
    onCancel?.(appointment.id);
  };

  const isClickable = !!onClick;
  const canCancel = appointment.status === 'confirmed' && !loading;
  const canReschedule = appointment.status === 'confirmed' && !loading;

  return (
    <Card
      variant="elevated"
      padding="medium"
      clickable={isClickable}
      onClick={isClickable ? handleCardClick : undefined}
      className="appointment-card"
    >
      <div className="appointment-card__header">
        <div className="appointment-card__title-section">
          <h3 className="appointment-card__title">
            {service?.name || texts.appointmentCard.appointment}
          </h3>
          <span className={`appointment-card__status appointment-card__status--${getStatusColor(appointment.status)}`}>
            {getStatusText(appointment.status)}
          </span>
        </div>
        {user && (
          <p className="appointment-card__user">
            {userRole === 'client' ? `${texts.appointmentCard.with} ` : ''}{user.name}
          </p>
        )}
      </div>

      <div className="appointment-card__details">
        <div className="appointment-card__datetime">
          <div className="appointment-card__date">
            {formatDate(appointment.startTime)}
          </div>
          <div className="appointment-card__time">
            {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
          </div>
        </div>

        {service && (
          <div className="appointment-card__service-info">
            {service.description && (
              <p className="appointment-card__description">
                {service.description}
              </p>
            )}
            <div className="appointment-card__service-details">
              <span className="appointment-card__duration">
                {service.duration} {texts.appointmentCard.minutes}
              </span>
              <span className="appointment-card__price">
                ${service.price}
              </span>
            </div>
          </div>
        )}
      </div>

      {(canCancel || canReschedule) && (
        <div className="appointment-card__actions">
          {canReschedule && onReschedule && (
            <Button
              variant="secondary"
              size="small"
              onClick={handleReschedule}
              disabled={loading}
            >
              {texts.actions.reschedule}
            </Button>
          )}
          {canCancel && onCancel && (
            <Button
              variant="danger"
              size="small"
              onClick={handleCancel}
              disabled={loading}
              loading={loading}
            >
              {texts.actions.cancel}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export type AppointmentStatus = 'confirmed' | 'cancelled';

export interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
}

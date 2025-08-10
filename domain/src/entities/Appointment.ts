/**
 * @file Defines the Appointment entity.
 */

export type AppointmentStatus = 'confirmed' | 'cancelled';

export interface Appointment {
  id: string;
  clientId: string;    // Foreign key to User
  serviceId: string;   // Foreign key to Service
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
}

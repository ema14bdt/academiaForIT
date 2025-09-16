import { Appointment } from '../entities/Appointment';
import { Availability } from '../entities/Availability';
import { Service } from '../entities/Service';

export class AppointmentValidationService {
  /**
   * Validates if an appointment can be scheduled within the available time slots
   */
  static validateTimeSlotAvailability(
    startTime: Date,
    endTime: Date,
    availabilities: Availability[]
  ): boolean {
    return availabilities.some(avail => 
      startTime >= avail.startTime && 
      endTime <= avail.endTime
    );
  }

  /**
   * Checks if the appointment conflicts with existing ones
   */
  static hasConflictingAppointments(
    startTime: Date,
    endTime: Date,
    existingAppointments: Appointment[]
  ): boolean {
    return existingAppointments.some(appointment => {
      // Skip cancelled appointments
      if (appointment.status === 'cancelled') return false;
      
      // Check for overlapping time slots
      return (startTime < appointment.endTime && endTime > appointment.startTime);
    });
  }

  /**
   * Calculates the end time based on service duration
   */
  static calculateEndTime(startTime: Date, service: Service): Date {
    return new Date(startTime.getTime() + service.duration * 60000);
  }

  /**
   * Validates appointment business rules
   */
  static validateAppointmentRules(appointment: Appointment): void {
    if (appointment.startTime >= appointment.endTime) {
      throw new Error('Start time must be before end time');
    }

    if (appointment.startTime < new Date()) {
      throw new Error('Cannot schedule appointments in the past');
    }
  }
}
/**
 * @file Defines the Availability entity for admin schedules.
 */

export interface Availability {
  id: string;
  adminId: string; // Foreign key to User
  startTime: Date;
  endTime: Date;
}

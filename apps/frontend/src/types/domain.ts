// Domain types mirroring the backend domain entities

export type Role = 'CLIENT' | 'PROFESSIONAL';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type AppointmentStatus = 'confirmed' | 'cancelled';

export interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
}

export interface Availability {
  id: string;
  professionalId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
}

// DTOs for API communication
export interface RegisterClientDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface BookAppointmentDto {
  serviceId: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
}

export interface CreateAvailabilityDto {
  date: string; // ISO string
  startTime: string; // ISO string
  endTime: string; // ISO string
}

// API Response types
export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

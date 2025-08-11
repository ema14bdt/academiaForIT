/**
 * @file Defines custom domain-specific errors.
 */

export class EmailAlreadyInUseError extends Error {
  constructor(message = 'Email already in use') {
    super(message);
    this.name = 'EmailAlreadyInUseError';
  }
}

export class AppointmentNotFoundError extends Error {
  constructor(message = 'Appointment not found') {
    super(message);
    this.name = 'AppointmentNotFoundError';
  }
}

export class AppointmentAlreadyCancelledError extends Error {
  constructor(message = 'Appointment is already cancelled') {
    super(message);
    this.name = 'AppointmentAlreadyCancelledError';
  }
}

export class UnauthorizedCancellationError extends Error {
  constructor(message = 'Unauthorized to cancel this appointment') {
    super(message);
    this.name = 'UnauthorizedCancellationError';
  }
}

export class InvalidCredentialsError extends Error {
  constructor(message = 'Invalid credentials') {
    super(message);
    this.name = 'InvalidCredentialsError';
  }
}

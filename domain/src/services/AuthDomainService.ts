import { User, Role } from '../entities/User';

export class AuthDomainService {
  /**
   * Validates if a user has permission to perform an action
   */
  static hasPermission(user: User, requiredRole: Role): boolean {
    return user.role === requiredRole;
  }

  /**
   * Checks if a user can access appointments
   */
  static canAccessAppointments(user: User, targetUserId: string): boolean {
    // Users can always access their own appointments
    if (user.id === targetUserId) return true;
    
    // Professionals can access all appointments
    return user.role === Role.PROFESSIONAL;
  }

  /**
   * Validates email format for registration
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validates password strength
   */
  static isValidPassword(password: string): boolean {
    // At least 8 characters, contains letters and numbers
    return password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);
  }

  /**
   * Determines if user can cancel appointments
   */
  static canCancelAppointment(user: User, appointmentClientId: string): boolean {
    // Clients can only cancel their own appointments
    if (user.role === Role.CLIENT) {
      return user.id === appointmentClientId;
    }
    
    // Professionals can cancel any appointment
    return user.role === Role.PROFESSIONAL;
  }
}
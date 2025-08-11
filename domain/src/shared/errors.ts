/**
 * @file Defines custom domain-specific errors.
 */

export class EmailAlreadyInUseError extends Error {
  constructor(message = 'Email already in use') {
    super(message);
    this.name = 'EmailAlreadyInUseError';
  }
}

// Add other custom errors here as needed

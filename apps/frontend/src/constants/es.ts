
export const texts = {
  // General
  loading: 'Cargando...',
  error: 'Ha ocurrido un error',
  actions: {
    login: 'Iniciar Sesión',
    logout: 'Cerrar Sesión',
    register: 'Registrarse',
    cancel: 'Cancelar',
    reschedule: 'Reprogramar',
    createAccount: 'Crear Cuenta',
  },

  // Login Form
  loginForm: {
    title: 'Iniciar Sesión',
    subtitle: '¡Bienvenido de nuevo! Por favor, inicia sesión en tu cuenta.',
    emailLabel: 'Correo Electrónico',
    emailPlaceholder: 'Ingresa tu correo electrónico',
    passwordLabel: 'Contraseña',
    passwordPlaceholder: 'Ingresa tu contraseña',
    noAccount: '¿No tienes una cuenta?',
    registerLink: 'Regístrate aquí',
  },

  // Register Form
  registerForm: {
    title: 'Crear Cuenta',
    subtitle: 'Únete a nosotros para comenzar a reservar tus turnos.',
    nameLabel: 'Nombre Completo',
    namePlaceholder: 'Ingresa tu nombre completo',
    emailLabel: 'Correo Electrónico',
    emailPlaceholder: 'Ingresa tu correo electrónico',
    passwordLabel: 'Contraseña',
    passwordPlaceholder: 'Crea una contraseña',
    passwordHelper: 'Debe tener al menos 8 caracteres',
    confirmPasswordLabel: 'Confirmar Contraseña',
    confirmPasswordPlaceholder: 'Confirma tu contraseña',
    haveAccount: '¿Ya tienes una cuenta?',
    loginLink: 'Inicia sesión aquí',
  },

  // Validation Messages
  validation: {
    required: (field: string) => `${field} es requerido`,
    invalidEmail: 'Por favor, ingresa un correo electrónico válido',
    minLength: (field: string, length: number) => `${field} debe tener al menos ${length} caracteres`,
    passwordsDoNotMatch: 'Las contraseñas no coinciden',
  },

  // Dashboard
  dashboard: {
    title: 'Sistema de Gestión de Turnos',
    welcome: (name: string) => `Bienvenido, ${name}`,
    yourAppointments: 'Tus Turnos',
  },

  // Appointment Card
  appointmentCard: {
    with: 'con',
    appointment: 'Turno',
    minutes: 'minutos',
    status: {
      confirmed: 'Confirmado',
      cancelled: 'Cancelado',
    },
  },

  // API Errors
  apiErrors: {
    loginFailed: 'El inicio de sesión falló. Revisa tus credenciales.',
    registrationFailed: 'El registro falló. Inténtalo de nuevo.',
    networkError: 'Error de red. Por favor, revisa tu conexión.',
    genericError: 'Ocurrió un error inesperado.',
  },
};

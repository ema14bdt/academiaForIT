# Sistema de Gestión de Turnos - Arquitectura Limpia

Este proyecto implementa un sistema de gestión de turnos, siguiendo los principios de Arquitectura Limpia (Clean Architecture) con Domain-Driven Design (DDD).

## 🏗️ Arquitectura

El proyecto está estructurado como un monorepo con separación clara de responsabilidades:

### Capas de la Arquitectura Limpia

- **Domain Layer** (`/domain`): Contiene la lógica de negocio pura
  - Entidades: User, Appointment, Service, Availability
  - Casos de uso: RegisterClient, LoginUser, BookAppointment, CreateAvailability
  - Puertos/Interfaces: IUserRepository, IAppointmentRepository, IAvailabilityRepository
  - Errores de dominio: UserAlreadyExistsError, InvalidCredentialsError, etc.

- **Application Layer** (`/apps/backend`): API REST con NestJS
  - Controladores: AuthController, UsersController, AppointmentsController
  - Servicios de aplicación: AuthService, AppointmentsService
  - Módulos: UsersModule, AuthModule, AppointmentsModule, AvailabilityModule
  - Repositorios en memoria para desarrollo

- **Presentation Layer** (`/apps/frontend`): Interfaz de usuario con React + TypeScript
  - Componentes de UI: Button, Input, Card
  - Componentes de negocio: LoginForm, BookingSection, MyAppointments
  - Hooks personalizados: useAuth
  - Cliente API: ApiClient
  - Visual TDD con Storybook

## 🚀 Configuración y Ejecución

### Prerrequisitos

- Node.js >= 18
- Yarn >= 1.22

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd arquitecturaLimpiaDominio

# Instalar dependencias (desde la raíz del proyecto)
yarn install
```

### Ejecución en Desarrollo

#### 1. Ejecutar Tests del Dominio

```bash
# Tests de la capa de dominio
yarn test:domain
```

#### 2. Ejecutar Backend (API)

```bash
# Desde la raíz del proyecto
cd apps/backend
yarn start:dev

# El backend estará disponible en http://localhost:3000
```

#### 3. Ejecutar Frontend

```bash
# En otra terminal, desde la raíz del proyecto
cd apps/frontend
yarn dev

# El frontend estará disponible en http://localhost:5173
```

#### 4. Ejecutar Storybook (Visual TDD)

```bash
# En otra terminal, desde apps/frontend
yarn storybook

# Storybook estará disponible en http://localhost:6006
```

### Tests

```bash
# Tests del dominio
yarn test:domain

# Tests del backend
yarn test:backend

# Tests del frontend (TDD implementado)
yarn test:frontend
yarn test:frontend:watch
yarn test:frontend:coverage

# Todos los tests (dominio + backend + frontend)
yarn test

# Tests con coverage completo
yarn test:coverage
```

## 🧪 TDD en Frontend

### Implementación Completa de TDD

El frontend implementa **Test-Driven Development (TDD)** con una suite completa de pruebas:

#### **Tests Unitarios**
- ✅ **Hooks**: `useAuth`, `useAppointments`
- ✅ **Servicios**: `ApiClient` con mocks de fetch
- ✅ **Componentes UI**: `Button`, `Input`, `Card`
- ✅ **Lógica de negocio**: Autenticación, gestión de citas

#### **Tests de Integración**
- ✅ **Componentes de negocio**: `LoginForm`, `MyAppointments`
- ✅ **Flujos completos**: Login, registro, reserva de citas
- ✅ **Interacción con API**: Mocks y simulación de respuestas

#### **Configuración de Testing**
- ✅ **Jest + Testing Library**: Framework de testing moderno
- ✅ **jsdom**: Entorno de testing para React
- ✅ **Coverage**: Reportes de cobertura de código
- ✅ **Mocks**: localStorage, fetch, API client

#### **Scripts de Testing Disponibles**
```bash
# Ejecutar solo tests de frontend
yarn test:frontend

# Tests en modo watch (desarrollo TDD)
yarn test:frontend:watch

# Coverage específico de frontend
yarn test:frontend:coverage

# Tests desde el workspace frontend
cd apps/frontend && yarn test
```

#### **Estructura de Tests**
```
apps/frontend/src/
├── components/ui/Button/__tests__/Button.test.tsx
├── hooks/__tests__/
│   ├── useAuth.test.tsx
│   └── useAppointments.test.ts
└── services/api/__tests__/ApiClient.test.ts
```

## 👥 Usuarios de Prueba

### Administrador/Profesional
- **Email**: admin@example.com
- **Contraseña**: Ver archivo .env para credenciales de desarrollo
- **Rol**: PROFESSIONAL

### Cliente de Prueba
- Puedes registrar nuevos clientes desde la interfaz
- **Rol**: CLIENT (asignado automáticamente)

## 🎯 Funcionalidades

### Para Clientes
- ✅ Registro e inicio de sesión
- ✅ Ver servicios disponibles
- ✅ Reservar citas
- ✅ Ver historial de citas
- ✅ Cancelar citas

### Para Profesionales/Administradores
- ✅ Inicio de sesión
- ✅ Gestionar disponibilidad
- ✅ Ver todas las citas reservadas
- ✅ Administrar horarios

### Servicios Disponibles
- **Consulta**: 30 minutos - $50
- **Terapia**: 60 minutos - $100
- **Evaluación**: 90 minutos - $150

## 🛠️ Tecnologías Utilizadas

### Backend
- **NestJS** 11.1.6 - Framework de Node.js
- **TypeScript** - Tipado estático
- **JWT** - Autenticación
- **bcrypt** - Hash de contraseñas
- **Jest** - Testing

### Frontend
- **React** 18 - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **Storybook** - Visual TDD
- **Jest + Testing Library** - TDD y testing unitario/integración
- **CSS Modules** - Estilos

### Dominio
- **TypeScript** - Lógica de negocio pura
- **Jest** - Testing de casos de uso
- **crypto.randomUUID()** - Identificadores únicos (Node.js built-in)

## 📁 Estructura del Proyecto

```
├── domain/                    # Capa de dominio
│   ├── src/
│   │   ├── entities/         # Entidades de negocio
│   │   ├── use-cases/        # Casos de uso
│   │   └── shared/           # Errores y utilidades
│   └── package.json
├── apps/
│   ├── backend/              # API REST
│   │   ├── src/
│   │   │   ├── auth/         # Módulo de autenticación
│   │   │   ├── users/        # Módulo de usuarios
│   │   │   ├── appointments/ # Módulo de citas
│   │   │   └── availability/ # Módulo de disponibilidad
│   │   └── test/             # Tests E2E
│   └── frontend/             # Interfaz de usuario
│       ├── src/
│       │   ├── components/   # Componentes React
│       │   ├── hooks/        # Hooks personalizados
│       │   ├── services/     # Cliente API
│       │   └── types/        # Tipos TypeScript
│       └── .storybook/       # Configuración Storybook
└── package.json              # Configuración del workspace
```

### Comandos Útiles

```bash
# Limpiar node_modules y reinstalar
yarn clean && yarn install

# Verificar tipos TypeScript
yarn type-check

# Ejecutar linter
yarn lint

# Build para producción
yarn build

# Tests con coverage completo
yarn test:coverage

# Tests específicos por proyecto
yarn test:domain
yarn test:backend  
yarn test:frontend

# Desarrollo con TDD (frontend)
yarn test:frontend:watch
```

## 📝 Notas de Implementación

- **Autenticación JWT** con roles (CLIENT, PROFESSIONAL)
- **Repositorios en memoria** para desarrollo (fácil migración a BD)
- **Validación** en múltiples capas (frontend, backend, dominio)
- **Manejo de errores** centralizado con tipos específicos
- **TDD completo** en frontend con Jest + Testing Library
- **Visual TDD** con Storybook para componentes UI
- **Internacionalización** preparada (textos en español)
- **Responsive design** con CSS modular
- **Yarn PnP** para gestión de dependencias estricta
- **UUID reemplazado** por crypto.randomUUID() nativo de Node.js

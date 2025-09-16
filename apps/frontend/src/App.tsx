import React, { useState } from 'react';
import { LoginForm } from './components/auth/LoginForm/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm/RegisterForm';
import { Button } from './components/ui/Button/Button';
import { useAuth } from './hooks/useAuth';
import { BookingSection } from './components/booking/BookingSection';
import { MyAppointments } from './components/appointments/MyAppointments';
import { AvailabilityManagement } from './components/admin/AvailabilityManagement';
import { BookedAppointments } from './components/admin/BookedAppointments';
import { texts } from './constants/es';
import './App.css';

type View = 'login' | 'register';

const AuthView = () => {
  const [currentView, setCurrentView] = useState<View>('login');

  return currentView === 'login' ? (
    <LoginForm onRegisterClick={() => setCurrentView('register')} />
  ) : (
    <RegisterForm onLoginClick={() => setCurrentView('login')} />
  );
};

const Dashboard = () => {
  const { user, logout } = useAuth();

  if (user?.role === 'PROFESSIONAL') {
    return <AdminDashboard />;
  }

  return <ClientDashboard />;
};

const ClientDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <>
      <header className="dashboard-header">
        <h1>Panel del Cliente</h1>
        <div className="user-info">
          {user && <span>Bienvenido, {user.name}</span>}
          <Button variant="secondary" onClick={logout}>
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-section">
          <h2>Mis Citas</h2>
          <MyAppointments />
        </div>
        
        <div className="dashboard-section">
          <h2>Reservar Nueva Cita</h2>
          <BookingSection />
        </div>
      </main>
    </>
  );
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <>
      <header className="dashboard-header">
        <h1>Panel de Administración</h1>
        <div className="user-info">
          {user && <span>Bienvenido, {user.name}</span>}
          <Button variant="secondary" onClick={logout}>
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-section">
          <AvailabilityManagement />
        </div>
        
        <div className="dashboard-section">
          <BookedAppointments />
        </div>
      </main>
    </>
  );
};

function App() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="app-container app-container--centered">
        <div className="app-loading">Cargando...</div>
      </div>
    );
  }

  return (
    <div className={`app-container ${!user ? 'app-container--centered' : ''}`}>
      {!user ? <AuthView /> : <Dashboard />}
    </div>
  );
}

export default App;

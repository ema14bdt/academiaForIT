import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth.tsx';
import { useAppointments } from './hooks/useAppointments';
import { LoginForm, RegisterForm } from './components/auth';
import { AppointmentCard } from './components/appointments';
import { Card } from './components/ui/Card/Card';
import { Button } from './components/ui/Button/Button';
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
  const { appointments, loading, error, cancelAppointment } = useAppointments();

  const handleCancel = async (id: string) => {
    try {
      await cancelAppointment(id);
    } catch (err) {
      console.error('Fallo al cancelar el turno', err);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <p>{texts.loading}</p>;
    }

    if (error) {
      return <p className="error-message">{error}</p>;
    }

    if (appointments.length === 0) {
      return <p>No tienes turnos programados.</p>;
    }

    return appointments.map(appt => (
      <AppointmentCard
        key={appt.id}
        appointment={appt}
        service={appt.service}
        userRole="client"
        onCancel={handleCancel}
      />
    ));
  };

  return (
    <>
      <header className="dashboard-header">
        <h1>{texts.dashboard.title}</h1>
        <div className="user-info">
          {user && <span>{texts.dashboard.welcome(user.name)}</span>}
          <Button variant="secondary" onClick={logout}>
            {texts.actions.logout}
          </Button>
        </div>
      </header>

      <main className="dashboard-main">
        <Card title={texts.dashboard.yourAppointments} variant="elevated" padding="large">
          <div className="appointments-list">
            {renderContent()}
          </div>
        </Card>
      </main>
    </>
  );
};

function App() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="app-container app-container--centered">
        <div className="app-loading">{texts.loading}</div>
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

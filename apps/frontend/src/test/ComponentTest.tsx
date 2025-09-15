import React from 'react';
import { Button } from '../components/ui/Button/Button';
import { Input } from '../components/ui/Input/Input';
import { Card } from '../components/ui/Card/Card';
import { LoginForm } from '../components/auth/LoginForm/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm/RegisterForm';
import { AppointmentCard } from '../components/appointments/AppointmentCard/AppointmentCard';
import type { Appointment, User } from '../types/domain';

// Test component to verify all components render correctly
export const ComponentTest: React.FC = () => {
  const mockUser: User = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'CLIENT'
  };

  const mockAppointment: Appointment = {
    id: '1',
    clientId: '1',
    serviceId: '1',
    startTime: new Date('2024-01-15T10:00:00'),
    endTime: new Date('2024-01-15T11:00:00'),
    status: 'confirmed'
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Component Test Page</h1>
      
      <section style={{ marginBottom: '40px' }}>
        <h2>UI Components</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="danger">Danger Button</Button>
          <Button variant="success">Success Button</Button>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <Input
            label="Test Input"
            placeholder="Enter text here"
            type="text"
          />
        </div>
        
        <Card title="Test Card" subtitle="This is a test card">
          <p>Card content goes here</p>
        </Card>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Authentication Components</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <LoginForm
            onSubmit={(credentials) => console.log('Login:', credentials)}
            onRegisterClick={() => console.log('Switch to register')}
          />
          <RegisterForm
            onSubmit={(userData) => console.log('Register:', userData)}
            onLoginClick={() => console.log('Switch to login')}
          />
        </div>
      </section>

      <section>
        <h2>Appointment Components</h2>
        <AppointmentCard
          appointment={mockAppointment}
          user={mockUser}
          service={{ id: '1', name: 'Consultation', duration: 60, price: 100 }}
          view="client"
          onCancel={(id) => console.log('Cancel appointment:', id)}
          onReschedule={(id) => console.log('Reschedule appointment:', id)}
        />
      </section>
    </div>
  );
};

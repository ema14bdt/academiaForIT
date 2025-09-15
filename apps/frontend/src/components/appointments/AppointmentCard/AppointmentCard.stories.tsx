import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { AppointmentCard } from './AppointmentCard';
import type { Appointment, Service, User } from '../../../types/domain';

// Mock data
const mockService: Service = {
  id: '1',
  name: 'General Consultation',
  description: 'Comprehensive health checkup and consultation',
  duration: 60,
  price: 150,
};

const mockProfessional: User = {
  id: '1',
  name: 'Dr. Sarah Johnson',
  email: 'sarah.johnson@clinic.com',
  role: 'PROFESSIONAL',
};

const mockClient: User = {
  id: '2',
  name: 'John Smith',
  email: 'john.smith@email.com',
  role: 'CLIENT',
};

const mockAppointment: Appointment = {
  id: '1',
  clientId: '2',
  serviceId: '1',
  startTime: new Date('2024-03-15T14:00:00'),
  endTime: new Date('2024-03-15T15:00:00'),
  status: 'confirmed',
};

const meta = {
  title: 'Appointments/AppointmentCard',
  component: AppointmentCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    userRole: {
      control: { type: 'select' },
      options: ['client', 'professional'],
    },
    loading: {
      control: { type: 'boolean' },
    },
  },
  args: { 
    onCancel: fn(),
    onReschedule: fn(),
    onClick: fn(),
  },
} satisfies Meta<typeof AppointmentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ClientView: Story = {
  args: {
    appointment: mockAppointment,
    service: mockService,
    user: mockProfessional,
    userRole: 'client',
  },
};

export const ProfessionalView: Story = {
  args: {
    appointment: mockAppointment,
    service: mockService,
    user: mockClient,
    userRole: 'professional',
  },
};

export const Cancelled: Story = {
  args: {
    appointment: {
      ...mockAppointment,
      status: 'cancelled',
    },
    service: mockService,
    user: mockProfessional,
    userRole: 'client',
  },
};

export const WithoutService: Story = {
  args: {
    appointment: mockAppointment,
    user: mockProfessional,
    userRole: 'client',
  },
};

export const WithoutUser: Story = {
  args: {
    appointment: mockAppointment,
    service: mockService,
    userRole: 'client',
  },
};

export const Loading: Story = {
  args: {
    appointment: mockAppointment,
    service: mockService,
    user: mockProfessional,
    userRole: 'client',
    loading: true,
  },
};

export const Clickable: Story = {
  args: {
    appointment: mockAppointment,
    service: mockService,
    user: mockProfessional,
    userRole: 'client',
    onClick: fn(),
  },
};

export const DentalAppointment: Story = {
  args: {
    appointment: {
      ...mockAppointment,
      startTime: new Date('2024-03-20T09:30:00'),
      endTime: new Date('2024-03-20T10:30:00'),
    },
    service: {
      id: '2',
      name: 'Dental Cleaning',
      description: 'Professional dental cleaning and oral examination',
      duration: 60,
      price: 120,
    },
    user: {
      id: '3',
      name: 'Dr. Michael Brown',
      email: 'michael.brown@dental.com',
      role: 'PROFESSIONAL',
    },
    userRole: 'client',
  },
};

export const TomorrowAppointment: Story = {
  args: {
    appointment: {
      ...mockAppointment,
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // Tomorrow + 1 hour
    },
    service: mockService,
    user: mockProfessional,
    userRole: 'client',
  },
};

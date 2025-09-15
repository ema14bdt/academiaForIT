import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { LoginForm } from './LoginForm';

const meta = {
  title: 'Auth/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: { type: 'boolean' },
    },
    showRegisterLink: {
      control: { type: 'boolean' },
    },
  },
  args: { 
    onSubmit: fn(),
    onRegisterClick: fn(),
  },
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const WithError: Story = {
  args: {
    error: 'Invalid email or password. Please try again.',
  },
};

export const WithSuccess: Story = {
  args: {
    success: 'Login successful! Redirecting...',
  },
};

export const WithoutRegisterLink: Story = {
  args: {
    showRegisterLink: false,
  },
};

export const FilledForm: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    // This would be used for interaction testing
    // const canvas = within(canvasElement);
    // await userEvent.type(canvas.getByLabelText('Email'), 'user@example.com');
    // await userEvent.type(canvas.getByLabelText('Password'), 'password123');
  },
};

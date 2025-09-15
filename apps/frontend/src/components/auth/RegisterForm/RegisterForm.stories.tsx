import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { RegisterForm } from './RegisterForm';

const meta = {
  title: 'Auth/RegisterForm',
  component: RegisterForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: { type: 'boolean' },
    },
    showLoginLink: {
      control: { type: 'boolean' },
    },
  },
  args: { 
    onSubmit: fn(),
    onLoginClick: fn(),
  },
} satisfies Meta<typeof RegisterForm>;

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
    error: 'An account with this email already exists.',
  },
};

export const WithSuccess: Story = {
  args: {
    success: 'Account created successfully! Please check your email to verify.',
  },
};

export const WithoutLoginLink: Story = {
  args: {
    showLoginLink: false,
  },
};

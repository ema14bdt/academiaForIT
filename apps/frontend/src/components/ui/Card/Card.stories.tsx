import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Card } from './Card';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'outlined', 'elevated'],
    },
    padding: {
      control: { type: 'select' },
      options: ['none', 'small', 'medium', 'large'],
    },
    clickable: {
      control: { type: 'boolean' },
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is a default card with some content.',
  },
};

export const WithTitle: Story = {
  args: {
    title: 'Card Title',
    children: 'This card has a title and some content below it.',
  },
};

export const WithTitleAndSubtitle: Story = {
  args: {
    title: 'Appointment Details',
    subtitle: 'Scheduled for tomorrow',
    children: 'Dr. Smith - General Consultation\n10:00 AM - 11:00 AM',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    title: 'Outlined Card',
    children: 'This card has an outlined style.',
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    title: 'Elevated Card',
    children: 'This card has a shadow and elevated appearance.',
  },
};

export const Clickable: Story = {
  args: {
    variant: 'elevated',
    title: 'Clickable Card',
    subtitle: 'Click me!',
    children: 'This card can be clicked and will respond to hover.',
    clickable: true,
  },
};

export const AppointmentCard: Story = {
  args: {
    variant: 'elevated',
    title: 'General Consultation',
    subtitle: 'Dr. Sarah Johnson',
    children: (
      <div>
        <p><strong>Date:</strong> March 15, 2024</p>
        <p><strong>Time:</strong> 2:00 PM - 3:00 PM</p>
        <p><strong>Status:</strong> Confirmed</p>
      </div>
    ),
  },
};

export const ServiceCard: Story = {
  args: {
    variant: 'outlined',
    title: 'Dental Cleaning',
    subtitle: '$150 - 60 minutes',
    children: 'Professional dental cleaning and examination. Includes fluoride treatment and oral health assessment.',
    clickable: true,
  },
};

export const NoPadding: Story = {
  args: {
    variant: 'outlined',
    padding: 'none',
    children: (
      <div style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Custom Padding</h4>
        <p style={{ margin: 0 }}>This card has no default padding, allowing for custom layouts.</p>
      </div>
    ),
  },
};

export const LargePadding: Story = {
  args: {
    variant: 'elevated',
    padding: 'large',
    title: 'Large Padding Card',
    children: 'This card has extra large padding for a more spacious feel.',
  },
};

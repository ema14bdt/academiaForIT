import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button = ({ children, variant = 'primary', ...props }: ButtonProps) => {
  const mode = `btn--${variant}`;
  return (
    <button
      type="button"
      className={['btn', mode].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
};

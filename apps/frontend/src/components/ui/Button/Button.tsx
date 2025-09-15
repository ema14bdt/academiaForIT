import React from 'react';
import './Button.css';

export interface ButtonProps {
  /** Button contents */
  children: React.ReactNode;
  /** What background color to use */
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  /** How large should the button be? */
  size?: 'small' | 'medium' | 'large';
  /** Optional click handler */
  onClick?: () => void;
  /** Is the button disabled? */
  disabled?: boolean;
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
  /** Full width button */
  fullWidth?: boolean;
  /** Loading state */
  loading?: boolean;
}

/**
 * Primary UI component for user interaction
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  disabled = false,
  type = 'button',
  fullWidth = false,
  loading = false,
  ...props
}) => {
  const className = [
    'btn',
    `btn--${size}`,
    `btn--${variant}`,
    fullWidth && 'btn--full-width',
    loading && 'btn--loading',
    disabled && 'btn--disabled'
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={className}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="btn__spinner">
          <span className="btn__spinner-inner"></span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

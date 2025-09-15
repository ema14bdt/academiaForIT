import React from 'react';
import './Card.css';

export interface CardProps {
  /** Card contents */
  children: React.ReactNode;
  /** Card title */
  title?: string;
  /** Card subtitle */
  subtitle?: string;
  /** Card variant */
  variant?: 'default' | 'outlined' | 'elevated';
  /** Card padding */
  padding?: 'none' | 'small' | 'medium' | 'large';
  /** Optional click handler */
  onClick?: () => void;
  /** Is the card clickable? */
  clickable?: boolean;
  /** Card className */
  className?: string;
}

/**
 * Card component for displaying content
 */
export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  variant = 'default',
  padding = 'medium',
  onClick,
  clickable = false,
  className = '',
  ...props
}) => {
  const cardClassName = [
    'card',
    `card--${variant}`,
    `card--padding-${padding}`,
    (clickable || onClick) && 'card--clickable',
    className
  ].filter(Boolean).join(' ');

  const CardComponent = onClick ? 'button' : 'div';

  return (
    <CardComponent
      className={cardClassName}
      onClick={onClick}
      {...props}
    >
      {(title || subtitle) && (
        <div className="card__header">
          {title && <h3 className="card__title">{title}</h3>}
          {subtitle && <p className="card__subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="card__content">
        {children}
      </div>
    </CardComponent>
  );
};

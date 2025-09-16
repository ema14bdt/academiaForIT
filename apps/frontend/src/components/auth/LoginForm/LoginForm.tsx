import React, { useState, useEffect } from 'react';
import { Input } from '../../ui/Input/Input';
import { Button } from '../../ui/Button/Button';
import { Card } from '../../ui/Card/Card';
import { LoginDto } from '../../../types/domain';
import { useAuth } from '../../../hooks/useAuth';
import { texts } from '../../../constants/es';
import './LoginForm.css';

export interface LoginFormProps {
  /** Called when register link is clicked */
  onRegisterClick?: () => void;
}

/**
 * Login form component
 */
export const LoginForm: React.FC<LoginFormProps> = ({ onRegisterClick }) => {
  const { login, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<LoginDto>({
    email: '',
    password: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<LoginDto>>({});

  useEffect(() => {
    // Clear errors when the component unmounts or the view changes
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleChange = (field: keyof LoginDto) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (error) {
      clearError();
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<LoginDto> = {};

    if (!formData.email) {
      errors.email = texts.validation.required('Email');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = texts.validation.invalidEmail;
    }

    if (!formData.password) {
      errors.password = texts.validation.required('Contraseña');
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        await login(formData);
      } catch (err) {
        // Error is already handled by the useAuth hook
      }
    }
  };

  return (
    <Card variant="elevated" padding="large" className="login-form">
      <form onSubmit={handleSubmit} className="login-form__form">
        <div className="login-form__header">
          <h2 className="login-form__title">{texts.loginForm.title}</h2>
          <p className="login-form__subtitle">{texts.loginForm.subtitle}</p>
        </div>

        {error && (
          <div className="login-form__message login-form__message--error">
            {error}
          </div>
        )}

        <div className="login-form__fields">
          <Input
            label={texts.loginForm.emailLabel}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange('email')}
            error={fieldErrors.email}
            placeholder={texts.loginForm.emailPlaceholder}
            required
            fullWidth
            disabled={loading}
          />

          <Input
            label={texts.loginForm.passwordLabel}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange('password')}
            error={fieldErrors.password}
            placeholder={texts.loginForm.passwordPlaceholder}
            required
            fullWidth
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="large"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          {texts.actions.login}
        </Button>

        <div className="login-form__footer">
          <p className="login-form__register-text">
            {texts.loginForm.noAccount}{' '}
            <button
              type="button"
              className="login-form__register-link"
              onClick={onRegisterClick}
              disabled={loading}
            >
              {texts.loginForm.registerLink}
            </button>
          </p>
        </div>
      </form>
    </Card>
  );
};

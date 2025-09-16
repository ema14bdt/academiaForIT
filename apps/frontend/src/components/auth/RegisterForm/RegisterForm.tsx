import React, { useState, useEffect } from 'react';
import { Input } from '../../ui/Input/Input';
import { Button } from '../../ui/Button/Button';
import { Card } from '../../ui/Card/Card';
import { RegisterClientDto } from '../../../types/domain';
import { useAuth } from '../../../hooks/useAuth';
import { texts } from '../../../constants/es';
import './RegisterForm.css';

export interface RegisterFormProps {
  /** Called when login link is clicked */
  onLoginClick?: () => void;
}

/**
 * Register form component
 */
export const RegisterForm: React.FC<RegisterFormProps> = ({ onLoginClick }) => {
  const { register, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<RegisterClientDto & { confirmPassword: string }>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<RegisterClientDto & { confirmPassword: string }>>({});

  useEffect(() => {
    // Clear errors when the component unmounts or the view changes
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleChange = (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (error) {
      clearError();
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<typeof formData> = {};

    if (!formData.name.trim()) {
      errors.name = texts.validation.required('Nombre');
    } else if (formData.name.trim().length < 2) {
      errors.name = texts.validation.minLength('Nombre', 2);
    }

    if (!formData.email) {
      errors.email = texts.validation.required('Email');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = texts.validation.invalidEmail;
    }

    if (!formData.password) {
      errors.password = texts.validation.required('Contraseña');
    } else if (formData.password.length < 8) {
      errors.password = texts.validation.minLength('Contraseña', 8);
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = texts.validation.required('Confirmar contraseña');
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = texts.validation.passwordsDoNotMatch;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      const { confirmPassword, ...submitData } = formData;
      try {
        await register(submitData);
        // Registration successful - user will be automatically logged in
        // The useAuth hook handles the redirect to dashboard
      } catch (err) {
        // Error is already handled by the useAuth hook
      }
    }
  };

  return (
    <Card variant="elevated" padding="large" className="register-form">
      <form onSubmit={handleSubmit} className="register-form__form">
        <div className="register-form__header">
          <h2 className="register-form__title">{texts.registerForm.title}</h2>
          <p className="register-form__subtitle">{texts.registerForm.subtitle}</p>
        </div>

        {error && (
          <div className="register-form__message register-form__message--error">
            {error}
          </div>
        )}

        <div className="register-form__fields">
          <Input
            label={texts.registerForm.nameLabel}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange('name')}
            error={fieldErrors.name}
            placeholder={texts.registerForm.namePlaceholder}
            required
            fullWidth
            disabled={loading}
          />

          <Input
            label={texts.registerForm.emailLabel}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange('email')}
            error={fieldErrors.email}
            placeholder={texts.registerForm.emailPlaceholder}
            required
            fullWidth
            disabled={loading}
          />

          <Input
            label={texts.registerForm.passwordLabel}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange('password')}
            error={fieldErrors.password}
            placeholder={texts.registerForm.passwordPlaceholder}
            helperText={texts.registerForm.passwordHelper}
            required
            fullWidth
            disabled={loading}
          />

          <Input
            label={texts.registerForm.confirmPasswordLabel}
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            error={fieldErrors.confirmPassword}
            placeholder={texts.registerForm.confirmPasswordPlaceholder}
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
          {texts.actions.createAccount}
        </Button>

        <div className="register-form__footer">
          <p className="register-form__login-text">
            {texts.registerForm.haveAccount}{' '}
            <button
              type="button"
              className="register-form__login-link"
              onClick={onLoginClick}
              disabled={loading}
            >
              {texts.registerForm.loginLink}
            </button>
          </p>
        </div>
      </form>
    </Card>
  );
};

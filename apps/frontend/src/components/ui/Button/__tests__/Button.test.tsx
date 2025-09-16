import { render, screen, fireEvent } from '@testing-library/react';
import { Button, ButtonProps } from '../Button';

// Mock de CSS imports para evitar errores
jest.mock('../Button.css', () => ({}));

describe('Button Component', () => {
  const defaultProps: Partial<ButtonProps> = {
    children: 'Test Button',
  };

  const renderButton = (props: Partial<ButtonProps> = {}) => {
    return render(<Button {...defaultProps} {...props} />);
  };

  describe('Renderizado básico', () => {
    it('debería renderizar correctamente con props por defecto', () => {
      renderButton();
      
      const button = screen.getByRole('button', { name: 'Test Button' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('btn', 'btn--medium', 'btn--primary');
      expect(button).toHaveAttribute('type', 'button');
      expect(button).not.toBeDisabled();
    });

    it('debería renderizar el texto children correctamente', () => {
      renderButton({ children: 'Click me!' });
      
      expect(screen.getByRole('button', { name: 'Click me!' })).toBeInTheDocument();
    });

    it('debería renderizar children como elemento React', () => {
      renderButton({ children: <span data-testid="custom-child">Custom Child</span> });
      
      expect(screen.getByTestId('custom-child')).toBeInTheDocument();
      expect(screen.getByText('Custom Child')).toBeInTheDocument();
    });
  });

  describe('Variantes (variants)', () => {
    it('debería aplicar la clase primary por defecto', () => {
      renderButton();
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--primary');
    });

    it('debería aplicar la clase secondary cuando variant es secondary', () => {
      renderButton({ variant: 'secondary' });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--secondary');
      expect(button).not.toHaveClass('btn--primary');
    });

    it('debería aplicar la clase danger cuando variant es danger', () => {
      renderButton({ variant: 'danger' });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--danger');
    });

    it('debería aplicar la clase success cuando variant es success', () => {
      renderButton({ variant: 'success' });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--success');
    });
  });

  describe('Tamaños (sizes)', () => {
    it('debería aplicar la clase medium por defecto', () => {
      renderButton();
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--medium');
    });

    it('debería aplicar la clase small cuando size es small', () => {
      renderButton({ size: 'small' });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--small');
      expect(button).not.toHaveClass('btn--medium');
    });

    it('debería aplicar la clase large cuando size es large', () => {
      renderButton({ size: 'large' });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--large');
    });
  });

  describe('Estados', () => {
    it('debería estar habilitado por defecto', () => {
      renderButton();
      
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
      expect(button).not.toHaveClass('btn--disabled');
    });

    it('debería estar deshabilitado cuando disabled es true', () => {
      renderButton({ disabled: true });
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('btn--disabled');
    });

    it('debería mostrar loading state', () => {
      renderButton({ loading: true });
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled(); // Loading debería deshabilitar el botón
      expect(button).toHaveClass('btn--loading');
      
      // Debería mostrar spinner en lugar del contenido
      expect(screen.getByText('Test Button')).not.toBeInTheDocument();
      expect(button.querySelector('.btn__spinner')).toBeInTheDocument();
      expect(button.querySelector('.btn__spinner-inner')).toBeInTheDocument();
    });

    it('debería estar deshabilitado durante loading incluso si disabled es false', () => {
      renderButton({ loading: true, disabled: false });
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Tipos de botón', () => {
    it('debería tener type button por defecto', () => {
      renderButton();
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('debería establecer type submit', () => {
      renderButton({ type: 'submit' });
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('debería establecer type reset', () => {
      renderButton({ type: 'reset' });
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'reset');
    });
  });

  describe('Ancho completo', () => {
    it('debería no tener full width por defecto', () => {
      renderButton();
      
      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('btn--full-width');
    });

    it('debería aplicar clase full width cuando fullWidth es true', () => {
      renderButton({ fullWidth: true });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn--full-width');
    });
  });

  describe('Eventos', () => {
    it('debería llamar onClick cuando se hace click', () => {
      const mockOnClick = jest.fn();
      renderButton({ onClick: mockOnClick });
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('debería no llamar onClick cuando está deshabilitado', () => {
      const mockOnClick = jest.fn();
      renderButton({ onClick: mockOnClick, disabled: true });
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('debería no llamar onClick cuando está en loading', () => {
      const mockOnClick = jest.fn();
      renderButton({ onClick: mockOnClick, loading: true });
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('debería llamar onClick con loading=false y disabled=false', () => {
      const mockOnClick = jest.fn();
      renderButton({ onClick: mockOnClick, loading: false, disabled: false });
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Props adicionales', () => {
    it('debería pasar props adicionales al elemento button', () => {
      render(
        <Button data-testid="custom-button" aria-label="Custom Label">
          Test
        </Button>
      );
      
      const button = screen.getByTestId('custom-button');
      expect(button).toHaveAttribute('aria-label', 'Custom Label');
    });
  });

  describe('Combinaciones de estados', () => {
    it('debería combinar múltiples clases correctamente', () => {
      renderButton({
        variant: 'danger',
        size: 'large',
        fullWidth: true,
        loading: true,
        disabled: true
      });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'btn',
        'btn--large',
        'btn--danger',
        'btn--full-width',
        'btn--loading',
        'btn--disabled'
      );
    });

    it('debería manejar todas las combinaciones de variant y size', () => {
      const variants: Array<ButtonProps['variant']> = ['primary', 'secondary', 'danger', 'success'];
      const sizes: Array<ButtonProps['size']> = ['small', 'medium', 'large'];

      variants.forEach(variant => {
        sizes.forEach(size => {
          const { unmount } = renderButton({ variant, size });
          
          const button = screen.getByRole('button');
          expect(button).toHaveClass(`btn--${variant}`, `btn--${size}`);
          
          unmount();
        });
      });
    });
  });

  describe('Accesibilidad', () => {
    it('debería ser accesible con screen reader cuando está deshabilitado', () => {
      renderButton({ disabled: true });
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      // El botón sigue siendo encontrable por rol aunque esté deshabilitado
      expect(button).toBeInTheDocument();
    });

    it('debería ser accesible con screen reader durante loading', () => {
      renderButton({ loading: true });
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toBeInTheDocument();
    });

    it('debería mantener focus management apropiado', () => {
      renderButton();
      
      const button = screen.getByRole('button');
      button.focus();
      expect(document.activeElement).toBe(button);
    });
  });
});
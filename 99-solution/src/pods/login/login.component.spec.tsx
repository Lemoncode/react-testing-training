import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setValidatorsMessagesToSpanish } from 'core/i18n';
import { LoginComponent } from './login.component';

describe('pods/login/login.component specs', () => {
  it('should render h1 title when it mounts the component', () => {
    // Arrange
    const props = {
      onLogin: jest.fn(),
    };

    // Act
    render(<LoginComponent {...props} />);
    const titleElement = screen.getByRole('heading', {
      level: 1,
      name: 'Login',
    });

    // Assert
    expect(titleElement).toBeInTheDocument();
  });

  it('should render login form when it mounts the component', () => {
    // Arrange
    const props = {
      onLogin: jest.fn(),
    };

    // Act
    render(<LoginComponent {...props} />);
    const userInputElement = screen.getByRole('textbox');
    const passwordInputElement = screen.getByLabelText('Contraseña *');
    const buttonElement = screen.getByRole('button', { name: /login/i });

    // Assert
    expect(userInputElement).toBeInTheDocument();
    expect(passwordInputElement).toBeInTheDocument();
    expect(buttonElement).toBeInTheDocument();
  });

  // *********  Avanzados   **********

  it('should error helper texts when it clicks on login button without fill the form', async () => {
    // Arrange
    const props = {
      onLogin: jest.fn(),
    };
    setValidatorsMessagesToSpanish();

    // Act
    render(<LoginComponent {...props} />);
    const buttonElement = screen.getByRole('button', { name: /login/i });
    userEvent.click(buttonElement);
    const helperTextList = await screen.findAllByText('Debe informar el campo');

    // Assert
    expect(helperTextList).toHaveLength(2);
  });

  it('should call to onLogin prop when it clicks on login button after fill the form', async () => {
    // Arrange
    const props = {
      onLogin: jest.fn(),
    };

    // Act
    render(<LoginComponent {...props} />);
    const buttonElement = screen.getByRole('button', { name: /login/i });
    const userInputElement = screen.getByRole('textbox');
    const passwordInputElement = screen.getByLabelText('Contraseña *');

    userEvent.type(userInputElement, 'test user');
    userEvent.type(passwordInputElement, 'test password');
    userEvent.click(buttonElement);

    // Assert
    // Reference: https://testing-library.com/docs/dom-testing-library/api-async#waitfor
    await waitFor(() =>
      expect(props.onLogin).toHaveBeenCalledWith({
        user: 'test user',
        password: 'test password',
      })
    );
  });
});

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useHistory } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { literals } from 'core/i18n';
import { routes } from 'core/router';
import * as snackbarHook from 'common/components/snackbar/snackbar.hook';
import * as api from './login.api';
import { LoginContainer } from './login.container';

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

// *********** Avanzado ***********
describe('pods/login/login.container specs', () => {
  it('should show error message when it feeds invalid credentials', async () => {
    // Arrange
    const showMessageSpy = jest.fn();
    const snackbarStub = jest
      .spyOn(snackbarHook, 'useSnackbarContext')
      .mockReturnValue({
        showMessage: showMessageSpy,
      });
    const isValidLoginStub = jest
      .spyOn(api, 'isValidLogin')
      .mockResolvedValue(false);

    // Act
    render(<LoginContainer />);
    const buttonElement = screen.getByRole('button', { name: /login/i });
    const userInputElement = screen.getByRole('textbox');
    const passwordInputElement = screen.getByLabelText('Contraseña *');

    userEvent.type(userInputElement, 'test user');
    userEvent.type(passwordInputElement, 'test password');
    userEvent.click(buttonElement);

    // Assert
    await waitFor(() => {
      expect(isValidLoginStub).toHaveBeenCalledWith(
        'test user',
        'test password'
      );
      expect(showMessageSpy).toHaveBeenCalledWith(
        literals.messages.errors.invalidLogin,
        'error'
      );
    });
  });

  it('should navigate to submoduleList when it feeds valid credentials', async () => {
    // Arrange
    const showMessageSpy = jest.fn();
    const snackbarStub = jest
      .spyOn(snackbarHook, 'useSnackbarContext')
      .mockReturnValue({
        showMessage: showMessageSpy,
      });
    const isValidLoginStub = jest
      .spyOn(api, 'isValidLogin')
      .mockResolvedValue(true);

    const history = useHistory();

    // Act
    render(<LoginContainer />);
    const buttonElement = screen.getByRole('button', { name: /login/i });
    const userInputElement = screen.getByRole('textbox');
    const passwordInputElement = screen.getByLabelText('Contraseña *');

    userEvent.type(userInputElement, 'test user');
    userEvent.type(passwordInputElement, 'test password');
    userEvent.click(buttonElement);

    // Assert
    await waitFor(() => {
      expect(isValidLoginStub).toHaveBeenCalledWith(
        'test user',
        'test password'
      );
      expect(history.push).toHaveBeenCalledWith(routes.submoduleList);
    });
  });
});

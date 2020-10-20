import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

describe('common/components/confirmation-dialog specs', () => {
  it('should not render dialog when it feeds isOpen equals false', () => {
    // Arrange
    const props = {
      isOpen: false,
      onAccept: jest.fn(),
      onClose: jest.fn(),
      title: 'test-title',
      labels: {
        closeButton: 'test-close-button',
        acceptButton: 'test-accept-button',
      },
    };

    // Act
    render(<ConfirmationDialogComponent {...props} />);

    const dialogElement = screen.queryByRole('dialog');

    // Assert
    expect(dialogElement).not.toBeInTheDocument();
  });

  it('should render dialog when it feeds isOpen equals true', () => {
    // Arrange
    const props = {
      isOpen: true,
      onAccept: jest.fn(),
      onClose: jest.fn(),
      title: 'test-title',
      labels: {
        closeButton: 'test-close-button',
        acceptButton: 'test-accept-button',
      },
      children: <h3>Test body component</h3>,
    };

    // Act
    render(<ConfirmationDialogComponent {...props} />);

    const dialogElement = screen.getByRole('dialog');
    const titleElement = screen.getByRole('heading', { level: 2 });
    const closeButtonElement = screen.getByRole('button', {
      name: 'test-close-button',
    });
    const acceptButtonElement = screen.getByRole('button', {
      name: 'test-accept-button',
    });
    const childrenElement = screen.getByRole('heading', { level: 3 });

    // Assert
    expect(dialogElement).toBeInTheDocument();
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.textContent).toEqual(props.title);
    expect(closeButtonElement).toBeInTheDocument();
    expect(acceptButtonElement).toBeInTheDocument();
    expect(childrenElement).toBeInTheDocument();
  });

  it('should call onClose prop when it clicks on Close button', () => {
    // Arrange
    const props = {
      isOpen: true,
      onAccept: jest.fn(),
      onClose: jest.fn(),
      title: 'test-title',
      labels: {
        closeButton: 'test-close-button',
        acceptButton: 'test-accept-button',
      },
      children: <h3>Test body component</h3>,
    };

    // Act
    render(<ConfirmationDialogComponent {...props} />);

    const closeButtonElement = screen.getByRole('button', {
      name: 'test-close-button',
    });
    userEvent.click(closeButtonElement);

    // Assert
    expect(props.onClose).toHaveBeenCalled();
  });

  it('should call onAccept and onClose prop when it clicks on Accept button', () => {
    // Arrange
    const props = {
      isOpen: true,
      onAccept: jest.fn(),
      onClose: jest.fn(),
      title: 'test-title',
      labels: {
        closeButton: 'test-close-button',
        acceptButton: 'test-accept-button',
      },
      children: <h3>Test body component</h3>,
    };

    // Act
    render(<ConfirmationDialogComponent {...props} />);

    const acceptButtonElement = screen.getByRole('button', {
      name: 'test-accept-button',
    });
    userEvent.click(acceptButtonElement);

    // Assert
    expect(props.onAccept).toHaveBeenCalled();
    expect(props.onClose).toHaveBeenCalled();
  });
});

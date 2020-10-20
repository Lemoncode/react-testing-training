import React from 'react';
import * as reactPromiseTracker from 'react-promise-tracker/lib/trackerHook';
import { render, screen } from '@testing-library/react';
import { SpinnerComponent } from './spinner.component';

describe('common/components/spinner.component specs', () => {
  it('should not render any loader when it feeds promiseInProgress equals false', () => {
    // Arrange
    const stub = jest
      .spyOn(reactPromiseTracker, 'usePromiseTracker')
      .mockReturnValue({ promiseInProgress: false });

    // Act
    render(<SpinnerComponent />);

    const loaderElement = screen.queryByLabelText('Loader icon');

    // Assert
    expect(stub).toHaveBeenCalled();
    expect(loaderElement).not.toBeInTheDocument();
  });

  it('should render loader when it feeds promiseInProgress equals true', () => {
    // Arrange
    const stub = jest
      .spyOn(reactPromiseTracker, 'usePromiseTracker')
      .mockReturnValue({ promiseInProgress: true });

    // Act
    render(<SpinnerComponent />);

    const loaderElement = screen.getByLabelText('Loader icon');

    // Assert
    expect(stub).toHaveBeenCalled();
    expect(loaderElement).toBeInTheDocument();
  });
});

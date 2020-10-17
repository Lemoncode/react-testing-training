import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBarComponent } from './search-bar.component';

describe('common/search-bar/search-bar.component specs', () => {
  it('should render an input with placeholder and searchIcon when it feeds required props', () => {
    // Arrange
    const props = {
      search: 'test search',
      onSearch: jest.fn(),
      labels: {
        placeholder: 'test placeholder',
      },
    };

    // Act
    render(<SearchBarComponent {...props} />);

    const inputElement = screen.getByRole('textbox') as HTMLInputElement;
    const iconElement = screen.getByLabelText('Search icon');

    // Assert
    expect(inputElement).toBeInTheDocument();
    expect(inputElement.value).toEqual('test search');
    expect(iconElement).toBeInTheDocument();
  });

  it('should call onSearch prop when it types on input change event', () => {
    // Arrange
    const props = {
      search: 'test search',
      onSearch: jest.fn(),
      labels: {
        placeholder: 'test placeholder',
      },
    };

    // Act
    render(<SearchBarComponent {...props} />);

    const inputElement = screen.getByRole('textbox');
    fireEvent.change(inputElement, { target: { value: 'new text search' } });

    // Assert
    expect(props.onSearch).toHaveBeenCalledWith('new text search');
  });
});

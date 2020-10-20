import React from 'react';
import { Formik, Form } from 'formik';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectComponent } from './select.component';
import { Lookup } from 'common/models';

const renderWithFormik = (component, initialValues) => {
  return {
    ...render(
      <Formik initialValues={initialValues} onSubmit={console.log}>
        {() => <Form>{component}</Form>}
      </Formik>
    ),
  };
};

describe('common/components/form/select/select.component specs', () => {
  it('should render a select element when it feeds required props and three items', () => {
    // Arrange
    const props = {
      items: [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
        { id: '3', name: 'Item 3' },
      ] as Lookup[],
      label: 'Test label',
      value: '',
    };

    // Act
    render(<SelectComponent {...props} />);
    const selectElement = screen.getByRole('button', { name: 'Test label' });

    // Assert
    expect(selectElement).toBeInTheDocument();
  });

  it('should render a menu with three item when it clicks on select element', () => {
    // Arrange
    const props = {
      items: [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
        { id: '3', name: 'Item 3' },
      ] as Lookup[],
      label: 'Test label',
      value: '',
    };

    // Act
    render(<SelectComponent {...props} />);
    const selectElement = screen.getByRole('button', { name: 'Test label' });

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    userEvent.click(selectElement);
    const menuElement = screen.getByRole('listbox');
    const itemList = screen.getAllByRole('option');

    userEvent.click(itemList[1]);

    // Assert
    expect(menuElement).toBeInTheDocument();
    expect(itemList).toHaveLength(3);
  });

  it('should update selected item when it clicks on third item using Formik', () => {
    // Arrange
    const props = {
      items: [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
        { id: '3', name: 'Item 3' },
      ] as Lookup[],
      label: 'Test label',
      name: 'selectedItem',
    };

    // Act
    renderWithFormik(<SelectComponent {...props} />, { selectedItem: '1' });

    const selectElement = screen.getByRole('button', {
      name: /Item 1/i,
    });

    userEvent.click(selectElement);
    const itemList = screen.getAllByRole('option');
    userEvent.click(itemList[1]);

    // Assert
    expect(selectElement).toBeInTheDocument();
    expect(selectElement.textContent).toEqual('Item 2');
  });
});

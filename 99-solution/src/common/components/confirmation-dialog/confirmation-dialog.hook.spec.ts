import { renderHook, act } from '@testing-library/react-hooks';
import { createEmptyLookup, Lookup } from 'common/models';
import { useConfirmationDialog } from './confirmation-dialog.hook';

describe('common/components/confirmation-dialog/confirmation-dialog.hooks specs', () => {
  it('should return default values when it renders the hook', () => {
    // Arrange

    // Act
    const { result } = renderHook(() => useConfirmationDialog());

    // Assert
    expect(result.current.isOpen).toBeFalsy();
    expect(result.current.itemToDelete).toEqual(createEmptyLookup());
    expect(result.current.onAccept).toEqual(expect.any(Function));
    expect(result.current.onClose).toEqual(expect.any(Function));
    expect(result.current.onOpenDialog).toEqual(expect.any(Function));
  });

  it('should update isOpen equals true and itemToDelete when it calls to onOpenDialog', () => {
    // Arrange
    const itemToDelete: Lookup = {
      id: 'test-id-1',
      name: 'test-name-1',
    };

    // Act
    const { result } = renderHook(() => useConfirmationDialog());
    act(() => {
      result.current.onOpenDialog(itemToDelete);
    });

    // Assert
    expect(result.current.isOpen).toBeTruthy();
    expect(result.current.itemToDelete).toEqual(itemToDelete);
  });

  it('should update isOpen equals false when it calls to onOpenDialog and then it calls to onClose', () => {
    // Arrange
    const itemToDelete: Lookup = {
      id: 'test-id-1',
      name: 'test-name-1',
    };

    // Act
    const { result } = renderHook(() => useConfirmationDialog());
    act(() => {
      result.current.onOpenDialog(itemToDelete);
      result.current.onClose();
    });

    // Assert
    expect(result.current.isOpen).toBeFalsy();
  });

  it('should update itemToDelete to default value when it calls to onOpenDialog and then it calls to onAccept', () => {
    // Arrange
    const itemToDelete: Lookup = {
      id: 'test-id-1',
      name: 'test-name-1',
    };

    // Act
    const { result } = renderHook(() => useConfirmationDialog());
    act(() => {
      result.current.onOpenDialog(itemToDelete);
      result.current.onAccept();
    });

    // Assert
    expect(result.current.itemToDelete).toEqual(createEmptyLookup());
  });
});

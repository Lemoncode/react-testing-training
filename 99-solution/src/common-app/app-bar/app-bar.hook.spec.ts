import { renderHook, act } from '@testing-library/react-hooks';
import { useMenu } from './app-bar.hook';

describe('common-app/app-bar/app-bar.hook specs', () => {
  it('should return default values when it renders the hook', () => {
    // Arrange

    // Act
    const { result } = renderHook(() => useMenu());

    // Assert
    expect(result.current.isOpen).toBeFalsy();
    expect(result.current.menuElement).toBeNull();
    expect(result.current.onOpenMenu).toEqual(expect.any(Function));
    expect(result.current.onCloseMenu).toEqual(expect.any(Function));
  });

  it('should update isOpen equals true and menuElement when it calls to onOpenMenu', () => {
    // Arrange
    const event = { currentTarget: {} } as React.MouseEvent<HTMLElement>;

    // Act
    const { result } = renderHook(() => useMenu());

    act(() => {
      result.current.onOpenMenu(event);
    });

    // Assert
    expect(result.current.isOpen).toBeTruthy();
    expect(result.current.menuElement).not.toBeNull();
  });

  it('should update isOpen equals false and menuElement equals null when it calls to onCloseMenu', () => {
    // Arrange
    const event = { currentTarget: {} } as React.MouseEvent<HTMLElement>;

    // Act
    const { result } = renderHook(() => useMenu());

    act(() => {
      result.current.onOpenMenu(event);
      result.current.onCloseMenu();
    });

    // Assert
    expect(result.current.isOpen).toBeFalsy();
    expect(result.current.menuElement).toBeNull();
  });
});

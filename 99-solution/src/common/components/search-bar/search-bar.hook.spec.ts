import { renderHook, act } from '@testing-library/react-hooks';
import { Lookup } from 'common/models';
import * as debounceHooks from 'common/hooks/debounce.hook';
import { useSearchBar } from './search-bar.hook';

describe('common/components/search-bar/search-bar.hook specs', () => {
  it('should return default values when it renders the hook', () => {
    // Arrange
    const collection: Lookup[] = [
      {
        id: '1',
        name: 'item-1',
      },
      {
        id: '2',
        name: 'item-2',
      },
      {
        id: '3',
        name: 'item-3',
      },
    ];

    const fields = ['name'];

    // Act
    const { result } = renderHook(() => useSearchBar(collection, fields));

    // Assert
    expect(result.current.search).toEqual('');
    expect(result.current.onSearch).toEqual(expect.any(Function));
    expect(result.current.filteredList).toEqual(collection);
  });

  it('should return filteredList with one item when it call onSearch method with text equals "item-2"', () => {
    // Arrange
    const collection: Lookup[] = [
      {
        id: '1',
        name: 'item-1',
      },
      {
        id: '2',
        name: 'item-2',
      },
      {
        id: '3',
        name: 'item-3',
      },
    ];

    const fields = ['name'];
    const newSearchText = 'item-2';

    const stub = jest
      .spyOn(debounceHooks, 'useDebounce')
      .mockReturnValue(newSearchText);

    // Act
    const { result } = renderHook(() => useSearchBar(collection, fields));

    act(() => {
      result.current.onSearch(newSearchText);
    });

    // Assert
    expect(result.current.search).toEqual(newSearchText);
    expect(result.current.filteredList).toEqual([{ id: '2', name: 'item-2' }]);
    expect(stub).toHaveBeenCalledWith(newSearchText, 250);
  });
});

import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { render, screen, within, RenderOptions } from '@testing-library/react';
import { State, rootReducers } from 'core/store';
import * as actions from './store/member-list.actions';
import { MemberListContainer } from './member-list.container';

interface Options extends RenderOptions {
  redux?: {
    reducer: any;
    initialState: any;
    store?: any;
  };
}

const renderWithRedux = (component, options: Options) => {
  const { redux, ...restOptions } = options;
  const reducer = Boolean(redux?.reducer) ? redux.reducer : (state) => state;
  const initialState = Boolean(redux?.initialState) ? redux.initialState : {};
  const store = Boolean(redux?.store)
    ? redux.store
    : createStore(reducer, initialState);

  return {
    ...render(<Provider store={store}>{component}</Provider>, restOptions),
    store,
  };
};

describe('pods/member-list/member-list.container specs', () => {
  it('should render empty array when it feeds initial state with empty member list', () => {
    // Arrange
    const initialState: State = {
      memberList: {
        list: [],
        serverError: null,
      },
    };

    // Act
    renderWithRedux(<MemberListContainer />, {
      redux: { initialState, reducer: rootReducers },
    });
    const tableBodyElement = screen.getAllByRole('rowgroup');
    const memberList = within(tableBodyElement[1]).queryAllByRole('row');

    // Assert
    expect(memberList).toHaveLength(0);
  });

  it('should render one item when it feeds initial state with one member', () => {
    // Arrange
    const initialState: State = {
      memberList: {
        list: [
          {
            id: 1,
            login: 'test-login-1',
            avatar_url: 'test-avatar-1',
          },
        ],
        serverError: null,
      },
    };

    // Act
    renderWithRedux(<MemberListContainer />, {
      redux: { initialState, reducer: rootReducers },
    });
    const tableBodyElement = screen.getAllByRole('rowgroup');
    const memberList = within(tableBodyElement[1]).queryAllByRole('row');

    // Assert
    expect(memberList).toHaveLength(1);
  });

  it('should render empty array when it feeds initial state with one member and serverError equals "test error"', () => {
    // Arrange
    const initialState: State = {
      memberList: {
        list: [
          {
            id: 1,
            login: 'test-login-1',
            avatar_url: 'test-avatar-1',
          },
        ],
        serverError: 'test error',
      },
    };

    // Act
    renderWithRedux(<MemberListContainer />, {
      redux: { initialState, reducer: rootReducers },
    });
    const tableElement = screen.queryByRole('table');
    const serverErrorElement = screen.getByText('test error');

    // Assert
    expect(tableElement).not.toBeInTheDocument();
    expect(serverErrorElement).toBeInTheDocument();
  });

  it('should call fetchMembersRequest when it mounts the component', () => {
    // Arrange
    const initialState: State = {
      memberList: {
        list: [],
        serverError: null,
      },
    };
    const stub = jest.spyOn(actions, 'fetchMembersRequest');

    // Act
    renderWithRedux(<MemberListContainer />, {
      redux: { initialState, reducer: rootReducers },
    });

    // Assert
    expect(stub).toHaveBeenCalled();
  });
});

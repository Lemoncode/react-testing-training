import deepFreeze from 'deep-freeze';
import { BaseAction } from 'common/models';
import {
  MemberListAction,
  FetchMembersSuccessAction,
  FetchMembersErrorAction,
} from './member-list.actions';
import { actionIds } from './member-list.action-ids';
import { Member } from '../api';
import { membersReducer, MemberListState } from './member-list.reducer';

describe('pods/member-list/store/member-list.reducer  tests', () => {
  it('should return the expected state when initialized with undefined initial state', () => {
    // Arrange
    const action: BaseAction = {
      type: 'foo',
      payload: null,
    };

    const initialState: MemberListState = {
      list: [],
      serverError: null,
    };

    // Act
    const result = membersReducer(undefined, action as MemberListAction);

    // Assert
    expect(result).toEqual(initialState);
  });

  it('should return the expected state when action type is FETCH_MEMBERS_SUCCESS', () => {
    // Arrange
    const members: Member[] = [
      { id: 1, login: 'test name', avatar_url: 'test avatar' },
    ];
    const action: FetchMembersSuccessAction = {
      type: actionIds.FETCH_MEMBERS_SUCCESS,
      payload: members,
    };
    const initialState: MemberListState = deepFreeze({
      list: [],
      serverError: 'test error',
    });

    // Act
    const result = membersReducer(initialState, action);

    // Assert
    expect(result.list).toBe(members);
    expect(result.serverError).toBeNull();
  });

  it('should return the expected state when action type is FETCH_MEMBERS_ERROR', () => {
    // Arrange
    const action: FetchMembersErrorAction = {
      type: actionIds.FETCH_MEMBERS_ERROR,
      payload: 'test error',
    };
    const initialState: MemberListState = deepFreeze({
      list: [],
      serverError: null,
    });

    // Act
    const result = membersReducer(initialState, action);

    // Assert
    expect(result.list).toBe(initialState.list);
    expect(result.serverError).toBe('test error');
  });

  it('should return the current state if action type is not known', () => {
    // Arrange
    const action: BaseAction = {
      type: 'foo',
      payload: null,
    };
    const initialState: MemberListState = deepFreeze({
      list: [],
      serverError: null,
    });

    // Act
    const result = membersReducer(initialState, action as MemberListAction);

    // Assert
    expect(result).toBe(initialState);
  });
});

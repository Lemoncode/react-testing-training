import { State } from 'core/store';
import * as mappers from '../member-list.mappers';
import * as viewModel from '../member-list.vm';
import {
  getMemberListState,
  getMemberList,
  getMemberListVm,
  getServerError,
} from './member-list.selectors';

describe('pods/member-list/store/member-list.selectors specs', () => {
  describe('getMemberListState', () => {
    it('should return memberList object from state', () => {
      // Arrange
      const state: State = {
        memberList: {
          list: [],
          serverError: null,
        },
      };

      // Act
      const result = getMemberListState(state);

      // Assert
      expect(result).toBe(state.memberList);
    });
  });

  describe('getMemberList', () => {
    it('should return empty array when it feeds state with empty array', () => {
      // Arrange
      const state: State = {
        memberList: {
          list: [],
          serverError: null,
        },
      };

      // Act
      const result = getMemberList(state);

      // Assert
      expect(result).toEqual([]);
    });

    it('should return an array with two members when it feeds state with two members', () => {
      // Arrange
      const state: State = {
        memberList: {
          list: [
            {
              id: 1,
              login: 'test-login-1',
              avatar_url: 'test-avatar-1',
            },
            {
              id: 2,
              login: 'test-login-2',
              avatar_url: 'test-avatar-2',
            },
          ],
          serverError: null,
        },
      };

      // Act
      const result = getMemberList(state);

      // Assert
      expect(result).toEqual([
        {
          id: 1,
          login: 'test-login-1',
          avatar_url: 'test-avatar-1',
        },
        {
          id: 2,
          login: 'test-login-2',
          avatar_url: 'test-avatar-2',
        },
      ]);
    });
  });

  describe('getMemberListVm', () => {
    it('should return an array with two view-model members when it feeds state with two api-model members', () => {
      // Arrange
      const state: State = {
        memberList: {
          list: [
            {
              id: 1,
              login: 'test-login-1',
              avatar_url: 'test-avatar-1',
            },
            {
              id: 2,
              login: 'test-login-2',
              avatar_url: 'test-avatar-2',
            },
          ],
          serverError: null,
        },
      };

      const viewModelMemberList: viewModel.Member[] = [
        {
          id: 1,
          name: 'test-login-1',
          avatarUrl: 'test-avatar-1',
        },
        {
          id: 2,
          name: 'test-login-2',
          avatarUrl: 'test-avatar-2',
        },
      ];
      const stub = jest
        .spyOn(mappers, 'mapMemberListModelToVM')
        .mockReturnValue(viewModelMemberList);

      // Act
      const result1 = getMemberListVm(state);
      const result2 = getMemberListVm(state);
      const result3 = getMemberListVm(state);

      // Assert
      expect(stub).toHaveBeenCalledWith(state.memberList.list);
      expect(stub).toBeCalledTimes(1);
      expect(result1).toBe(viewModelMemberList);
      expect(result1 === result2).toBeTruthy();
      expect(result2 === result3).toBeTruthy();
    });
  });

  describe('getServerError', () => {
    it('should return the expected serverError from state', () => {
      // Arrange
      const state: State = {
        memberList: {
          list: [],
          serverError: 'test error',
        },
      };

      // Act
      const result = getServerError(state);

      // Assert
      expect(result).toEqual('test error');
    });
  });
});

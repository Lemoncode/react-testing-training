import { takeLatest } from 'redux-saga/effects';
import { runSaga } from 'common/test';
import { actionIds } from './member-list.action-ids';
import { Member } from '../api';
import * as api from '../api/member-list.api';
import { fetchMembersRequest } from './member-list.actions';
import {
  watchFetchMembersRequest,
  fetchMembersSaga,
} from './member-list.sagas';

describe('pods/member-list/store/member-list.sagas specs', () => {
  describe('watchFetchMembersRequest', () => {
    it('should wait for expected action and execute the expected worker', () => {
      // Arrange

      // Act
      const saga = watchFetchMembersRequest();
      const result = saga.next();

      // Assert
      expect(result.value).toEqual(
        takeLatest(actionIds.FETCH_MEMBERS_REQUEST, fetchMembersSaga)
      );
    });
  });

  describe('fetchMembersSaga', () => {
    it('should put fetchMembersSuccess with given members when API call is succesful', async () => {
      // Arrange
      const members: Member[] = [
        { id: 1, login: 'test login', avatar_url: 'test avatar' },
      ];
      const initialAction = fetchMembersRequest();
      const fetchMembersStub = jest
        .spyOn(api, 'fetchMembers')
        .mockResolvedValue(members);

      // Act
      const result = await runSaga(fetchMembersSaga, initialAction);

      // Assert
      expect(fetchMembersStub).toHaveBeenCalled();
      expect(result).toEqual([
        {
          type: actionIds.FETCH_MEMBERS_SUCCESS,
          payload: members,
        },
      ]);
    });

    it('should put fetchMembersError with given error when API call is not succesful', async () => {
      // Arrange
      const axiosError = {
        response: {
          statusText: 'test error',
        },
      };
      const initialAction = fetchMembersRequest();
      const fetchMembersStub = jest
        .spyOn(api, 'fetchMembers')
        .mockRejectedValue(axiosError);

      // Act
      const result = await runSaga(fetchMembersSaga, initialAction);

      // Assert
      expect(fetchMembersStub).toHaveBeenCalled();
      expect(result).toEqual([
        {
          type: actionIds.FETCH_MEMBERS_ERROR,
          payload: 'test error',
        },
      ]);
    });
  });
});

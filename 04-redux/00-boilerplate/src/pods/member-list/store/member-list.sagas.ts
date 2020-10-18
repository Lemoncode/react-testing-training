import { AxiosError } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchMembers, Member } from '../api';
import { actionIds } from './member-list.action-ids';
import { fetchMembersError, fetchMembersSuccess } from './member-list.actions';

export function* watchFetchMembersRequest() {
  yield takeLatest(actionIds.FETCH_MEMBERS_REQUEST, fetchMembersSaga);
}

export function* fetchMembersSaga() {
  try {
    const members: Member[] = yield call(fetchMembers);
    yield put(fetchMembersSuccess(members));
  } catch (error) {
    const errorMessage = (error as AxiosError).response.statusText
    yield put(fetchMembersError(errorMessage));
  }
}

export function* membersRootSaga() {
  yield watchFetchMembersRequest();
}

import { all } from 'redux-saga/effects';
import { membersRootSaga } from 'pods/member-list';

export function* rootSaga() {
  yield all([membersRootSaga()]);
}

import * as reduxSaga from 'redux-saga';
import { Saga } from 'redux-saga';
import { BaseAction } from 'common/models';

export const runSaga = async <S>(
  saga: Saga,
  initialAction: BaseAction,
  state?: S
) => {
  const dispatchedActions = [];

  await reduxSaga
    .runSaga(
      {
        dispatch: (action) => dispatchedActions.push(action),
        getState: () => state,
      },
      saga,
      initialAction
    )
    .toPromise();

  return dispatchedActions;
};

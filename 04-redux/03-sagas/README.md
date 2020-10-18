# 03 Sagas

In this sample we are going to test Redux sagas.

We will start from sample _02-reducers_.

Summary steps:

- Add tests for `fetchMembersSaga.ts` saga

# Steps to build it

- Be sure dependencies are installed, otherwise just run:

```bash
npm install
```

- A saga is nothing but a generator. So in order to test a saga we can test it as a normal generator. The good news when testing sagas is that all `redux-saga` effects are declarative and just descriptions of what is need to be done.

- Let's create the `fetchMembersSaga.spec.ts` file near to its implementation under `./src/pages/members/list/sagas`:

_./src/pods/member-list/store/member-list.sagas.spec.ts_

```javascript
describe('pods/member-list/store/member-list.sagas specs', () => {});
```

- The first saga we test will be the watcher one. Let's add a separated spec for that one:

_./src/pods/member-list/store/member-list.sagas.spec.ts_

```diff
+ import { watchFetchMembersRequest } from './member-list.sagas';

  describe('pods/member-list/store/member-list.sagas specs', () => {
+   describe('watchFetchMembersRequest', () => {
+     it('should wait for expected action and execute the expected worker', () => {
+       // Arrange
+
+       // Act
+
+       // Assert
+     });
+   });
  });
```

- In order to test that generator we need to create an instance of `watchFetchMembersRequest` and compare results of
`instance.next().value` with what we expect:

_./src/pods/member-list/store/member-list.sagas.spec.ts_

```diff
+ import { takeLatest } from 'redux-saga/effects';
+ import { actionIds } from './member-list.action-ids';
- import { watchFetchMembersRequest } from './member-list.sagas';
+ import { watchFetchMembersRequest, fetchMembersSaga } from './member-list.sagas';

describe('pods/member-list/store/member-list.sagas specs', () => {
  describe('watchFetchMembersRequest', () => {
    it('should wait for expected action and execute the expected worker', () => {
      // Arrange

      // Act
+     const saga = watchFetchMembersRequest();
+     const result = saga.next();

      // Assert
+     expect(result.value).toEqual(takeLatest(actionIds.FETCH_MEMBERS_REQUEST, fetchMembersSaga));
    });
  });
});
```

- Next we'll test the worker one: `fetchMembersSaga`. As we can see it has some `yield` so we'll need to get the value and assert.
Let's start with the case when the API call is successful and return a members list:

_./src/pods/member-list/store/member-list.sagas.spec.ts_

```diff
- import { takeLatest } from 'redux-saga/effects';
+ import { takeLatest, call, put } from 'redux-saga/effects';
import { actionIds } from './member-list.action-ids';
+ import { Member, fetchMembers } from '../api';
+ import { fetchMembersSuccess } from './member-list.actions';
import { watchFetchMembersRequest, fetchMembersSaga } from './member-list.sagas';

...
+ describe('fetchMembersSaga', () => {
+   it('should put fetchMembersSuccess with given members when API call is succesful', () => {
+     // Arrange
+     const members: Member[] = [
+       { id: 1, login: 'test login', avatar_url: 'test avatar' },
+     ];
     
+     // Act
+     const saga = fetchMembersSaga();
     
+     // Assert
+     expect(saga.next().value).toEqual(call(fetchMembers));
+     expect(saga.next(members).value).toEqual(
+       put(fetchMembersSuccess(members))
+     );
+   });
+ });
```

- We'll explore another way to test sagas. This approximation can be used only when a saga ends and is not stuck in blocking calls in a infinite loop and it will give us all dispatched actions to the store via `put` effect. Let's create the folder `src/common/test` that will be used to store all our test utilities. Now we'll create a `sagas-helpers.ts` file:

_./src/common/test/sagas-helpers.ts_

```javascript
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

```

> [Reference](https://dev.to/phil/the-best-way-to-test-redux-sagas-4hib)

- Let's add a barrel for our `test` folder:

_./src/common/test/index.ts_

```javascript
export * from './sagas-helpers';

```

- Since using this approximation the saga will be launched as in real app we need to mock the API call.

_./src/pods/member-list/store/member-list.sagas.spec.ts_

```diff
- import { takeLatest, call, put } from 'redux-saga/effects';
+ import { takeLatest } from 'redux-saga/effects';
+ import { runSaga } from 'common/test';
import { actionIds } from './member-list.action-ids';
- import { Member, fetchMembers } from '../api';
+ import { Member } from '../api';
+ import * as api from '../api/member-list.api';
- import { fetchMembersSuccess } from './member-list.actions';
+ import { fetchMembersRequest } from './member-list.actions';
import {
  watchFetchMembersRequest,
  fetchMembersSaga,
} from './member-list.sagas';

...
-   it('should put fetchMembersSuccess with given members when API call is succesful', () => {
+   it('should put fetchMembersSuccess with given members when API call is succesful', async() => {
      // Arrange
      const members: Member[] = [
        { id: 1, login: 'test login', avatar_url: 'test avatar' },
      ];
+     const initialAction = fetchMembersRequest();
+     const fetchMembersStub = jest
+       .spyOn(api, 'fetchMembers')
+       .mockResolvedValue(members);

      // Act
-     const saga = fetchMembersSaga();
+     const result = await runSaga(fetchMembersSaga, initialAction);

      // Assert
-     expect(saga.next().value).toEqual(call(fetchMembers));
-     expect(saga.next(members).value).toEqual(
-       put(fetchMembersSuccess(members))
-     );
+     expect(fetchMembersStub).toHaveBeenCalled();
+     expect(result).toEqual([
+       {
+         type: actionIds.FETCH_MEMBERS_SUCCESS,
+         payload: members,
+       },
+     ]);
    });

```

- Resolve alias in specs:

_./config/test/jest.js_

```diff
module.exports = {
  rootDir: '../../',
  preset: 'ts-jest',
  restoreMocks: true,
  setupFilesAfterEnv: ['<rootDir>/config/test/setup-after.ts'],
+ moduleDirectories: ['<rootDir>/src', 'node_modules'],
};

```
> [Reference](https://jestjs.io/docs/en/configuration#moduledirectories-arraystring)

- Now we'll test the non happy path when API returns an error:

_./src/pods/member-list/store/member-list.sagas.spec.ts_

```diff
...
+   it('should put fetchMembersError with given error when API call is not succesful', async () => {
+     // Arrange
+     const axiosError = {
+       response: {
+         statusText: 'test error',
+       },
+     };
+     const initialAction = fetchMembersRequest();
+     const fetchMembersStub = jest
+       .spyOn(api, 'fetchMembers')
+       .mockRejectedValue(axiosError);

+     // Act
+     const result = await runSaga(fetchMembersSaga, initialAction);

+     // Assert
+     expect(fetchMembersStub).toHaveBeenCalled();
+     expect(result).toEqual([
+       {
+         type: actionIds.FETCH_MEMBERS_ERROR,
+         payload: 'test error',
+       },
+     ]);
+   });
```

> [More info](https://redux-saga.js.org/docs/advanced/Testing.html)

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend

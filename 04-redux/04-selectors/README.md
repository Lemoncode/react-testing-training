# 04 Selectors

In this sample we are going to test Redux sagas.

We will start from sample _03-sagas_.

Summary steps:

- Create `member-list` selectors
- Create viewmodel selector with `reselect`
- Create proper tests for created selectors

# Steps to build it

- Be sure dependencies are installed, otherwise just run:

```bash
npm install
```

A selector is nothing that a function that picks a slice from state. Selectors are useful for composition and abstraction. We'll install `reselect` to create memoized selectors. Memoized selectors are useful when we apply transformations from the redux state to another entity and we don't want to run that transformation again if that slice of state is not changed.

```bash
npm install reselect --save
```

- Let's create a `selectors`. And create our first selector. This selector will get the root `member` from state:

_./src/pods/member-list/store/member-list.selectors.ts_

```ts
import { State } from 'core/store';

export const getMemberListState = (state: State) => state.memberList;

```

- Then we'll import `createSelector` from `reselect` to start creating cached selectors with composition:

_./src/pods/member-list/store/member-list.selectors.ts_

```diff
+ import { createSelector } from 'reselect';
import { State } from 'core/store';

export const getMemberListState = (state: State) => state.memberList;

+ export const getMemberList = createSelector(
+   getMemberListState,
+   ({ list }) => list
+ );

```

- Next we'll create our first viewmodel selector that picks the member list from state and transforms them in `Member` entity from our viewmodel:

_./src/pods/member-list/store/member-list.selectors.ts_

```diff
import { createSelector } from 'reselect';
import { State } from 'core/store';
+ import { mapMemberListModelToVM } from '../member-list.mappers';

export const getMemberListState = (state: State) => state.memberList;

export const getMemberList = createSelector(
  getMemberListState,
  ({ list }) => list
);

+ export const getMemberListVm = createSelector(getMemberList, (memberList) =>
+   mapMemberListModelToVM(memberList)
+ );

```

- Finally let's create another selector to pick `serverError` from state:

_./src/pods/member-list/store/member-list.selectors.ts_

```diff
...
+ export const getServerError = createSelector(
+   getMemberListState,
+   ({ serverError }) => serverError
+ );
```

- Update barrel file:

_./src/pods/member-list/store/index.ts_

```diff
export * from './member-list.sagas';
export * from './member-list.reducer';
export * from './member-list.actions';
+ export * from './member-list.selectors';

```

- Let's use our selectors in `container`:

_./src/pods/member-list/member-list.container.tsx_

```diff
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { State } from 'core/store';
- import { MemberListAction, fetchMembersRequest } from './store';
+ import { MemberListAction, fetchMembersRequest, getMemberListVm, getServerError } from './store';
- import { mapMemberListModelToVM } from './member-list.mappers';
import { Member } from './member-list.vm';
import { MemberListComponent } from './member-list.component';

...
const mapStateToProps = (state: State) => ({
- memberList: mapMemberListModelToVM(state.memberList.list),
+ memberList: getMemberListVm(state),
- serverError: state.memberList.serverError,
+ serverError: getServerError(state),
});
...

```

- Let's create a `selectors.spec.ts` file near implementation to test they work as expected:

_./src/pods/member-list/store/member-list.selectors.spec.ts_

```ts
describe('pods/member-list/store/member-list.selectors specs', () => {});
```

- First selector we'll test is `getMembersState`. We should test it provides the expected slice from state:

_./src/pods/member-list/store/member-list.selectors.spec.ts_

```diff
+ import { State } from 'core/store';
+ import {
+   getMemberListState,
+   getMemberList,
+   getMemberListVm,
+   getServerError,
+ } from './member-list.selectors';


describe('pods/member-list/store/member-list.selectors specs', () => {
+   describe('getMemberListState', () => {
+     it('should return memberList object from state', () => {
+       // Arrange
+       const state: State = {
+         memberList: {
+           list: [],
+           serverError: null,
+         },
+       };

+       // Act
+       const result = getMemberListState(state);

+       // Assert
+       expect(result).toBe(state.memberList);
+     });
+   });
});
```

- Next We'll test `getMembersList`. It should return members list from state:

_./src/pods/member-list/store/member-list.selectors.spec.ts_

```diff
...
+ describe('getMemberList', () => {
+   it('should return empty array when it feeds state with empty array', () => {
+     // Arrange
+     const state: State = {
+       memberList: {
+         list: [],
+         serverError: null,
+       },
+     };

+     // Act
+     const result = getMemberList(state);

+     // Assert
+     expect(result).toEqual([]);
+   });
+ });
```

- Add spec feeding member list:

_./src/pods/member-list/store/member-list.selectors.spec.ts_

```diff
...
+   it('should return an array with two members when it feeds state with two members', () => {
+     // Arrange
+     const state: State = {
+       memberList: {
+         list: [
+           {
+             id: 1,
+             login: 'test-login-1',
+             avatar_url: 'test-avatar-1',
+           },
+           {
+             id: 2,
+             login: 'test-login-2',
+             avatar_url: 'test-avatar-2',
+           },
+         ],
+         serverError: null,
+       },
+     };

+     // Act
+     const result = getMemberList(state);

+     // Assert
+     expect(result).toEqual([
+       {
+         id: 1,
+         login: 'test-login-1',
+         avatar_url: 'test-avatar-1',
+       },
+       {
+         id: 2,
+         login: 'test-login-2',
+         avatar_url: 'test-avatar-2',
+       },
+     ]);
+   });
```


- Now we'll test `getMembersListVM` selector. It relies on `mapMemberListModelToVM` to return the result so we'll have to mock it:

_./src/pods/member-list/store/member-list.selectors.spec.ts_

```diff
import { State } from 'core/store';
+ import * as mappers from '../member-list.mappers';
+ import * as viewModel from '../member-list.vm';
import {
  getMemberListState,
  getMemberList,
  getMemberListVm,
  getServerError,
} from './member-list.selectors';

...
+ describe('getMemberListVm', () => {
+   it('should return an array with two view-model members when it feeds state with two api-model members', () => {
+     // Arrange
+     const state: State = {
+       memberList: {
+         list: [
+           {
+             id: 1,
+             login: 'test-login-1',
+             avatar_url: 'test-avatar-1',
+           },
+           {
+             id: 2,
+             login: 'test-login-2',
+             avatar_url: 'test-avatar-2',
+           },
+         ],
+         serverError: null,
+       },
+     };

+     const viewModelMemberList: viewModel.Member[] = [
+       {
+         id: 1,
+         name: 'test-login-1',
+         avatarUrl: 'test-avatar-1',
+       },
+       {
+         id: 2,
+         name: 'test-login-2',
+         avatarUrl: 'test-avatar-2',
+       },
+     ];
+     const stub = jest
+       .spyOn(mappers, 'mapMemberListModelToVM')
+       .mockReturnValue(viewModelMemberList);

+     // Act
+     const result = getMemberListVm(state);

+     // Assert
+     expect(stub).toHaveBeenCalledWith(state.memberList.list);
+     expect(result).toBe(viewModelMemberList);
+   });
+ });
```

- We could even test the selector computes the result once if we called it multiple times. We'll add another spec for that, however this test should not be necessary.

_./src/pods/member-list/store/member-list.selectors.spec.ts_

```diff
...

      const stub = jest
        .spyOn(mappers, 'mapMemberListModelToVM')
        .mockReturnValue(viewModelMemberList);

      // Act
-     const result = getMemberListVm(state);
+     const result1 = getMemberListVm(state);
+     const result2 = getMemberListVm(state);
+     const result3 = getMemberListVm(state);

      // Assert
      expect(stub).toHaveBeenCalledWith(state.memberList.list);
+     expect(stub).toBeCalledTimes(1);
-     expect(result).toBe(viewModelMemberList);
+     expect(result1).toBe(viewModelMemberList);
+     expect(result1 === result2).toBeTruthy();
+     expect(result2 === result3).toBeTruthy();
    });
```

- Finally let's test `getServerError` selector:

```diff
...

+ describe('getServerError', () => {
+   it('should return the expected serverError from state', () => {
+     // Arrange
+     const state: State = {
+       memberList: {
+         list: [],
+         serverError: 'test error',
+       },
+     };

+     // Act
+     const result = getServerError(state);

+     // Assert
+     expect(result).toEqual('test error');
+   });
+ });
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend

# 02 Reducers

In this sample we are going to test Redux reducers.

We will start from sample _01-actions_.

Summary steps:

- Add tests for member list reducer.

# Steps to build it

- Be sure dependencies are installed, otherwise just run:

```bash
npm install
```

First we'll add a new dependency: `deep-freeze`. This library is useful to ensure our reducers keeps state transformations immutable.

```bash
npm i -D deep-freeze
```

Let's launch jest in watch mode to start the sample:

```bash
npm run test:watch
```

- We will start creating a `member-list.reducer.spec.ts`

_./src/pods/member-list/store/member-list.reducer.spec.ts_

```javascript
describe('pods/member-list/store/member-list.reducer  tests', () => {
  it('', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

Redux reducers have a minimum of three executions. The first one is when the store is initialized and every reducer creates all chunks of the initial state (if initialState is not fed in `createStore` at the time of creating the store). Redux will launch a `@@INIT` action to initialize all reducers. So let's use that text as the first one:

_./src/pods/member-list/store/member-list.reducer.spec.ts_

```diff
+ import { BaseAction } from 'common/models';
+ import { MemberListAction } from './member-list.actions';
+ import { membersReducer, MemberListState } from './member-list.reducer';

  describe('pods/member-list/store/member-list.reducer  tests', () => {
+   it('should return the expected state when initialized with undefined initial state', () => {
      // Arrange
+     const action: BaseAction = {
+       type: 'foo',
+       payload: null,
+     };

+     const initialState: MemberListState = {
+       list: [],
+       serverError: null,
+     };

      // Act
+     const result = membersReducer(undefined, action as MemberListAction);

      // Assert
+     expect(result).toEqual(initialState);
    });
  });
```

- Next we'll test the behavior when it receives an action with type FETCH_MEMBERS_SUCCESS. It should update `members` and reset `serverError`:

_./src/pods/member-list/store/member-list.reducer.spec.ts_

```diff
+ import deepFreeze from 'deep-freeze';
import { BaseAction } from 'common/models';
- import { MemberListAction } from './member-list.actions';
+ import { MemberListAction, FetchMembersSuccessAction } from './member-list.actions';
+ import { actionIds } from './member-list.action-ids';
+ import { Member } from '../api';
import { membersReducer, MembersState } from './members';

..

+   it('should return the expected state when action type is FETCH_MEMBERS_SUCCESS', () => {
+     // Arrange
+     const members: Member[] = [{ id: 1, login: 'test name', avatar_url: 'test avatar' }];
+     const action: FetchMembersSuccessAction = {
+       type: actionIds.FETCH_MEMBERS_SUCCESS,
+       payload: members,
+     };
+     const initialState: MemberListState = deepFreeze({
+       list: [],
+       serverError: 'test error',
+     });

+     // Act
+     const result = membersReducer(initialState, action);

+     // Assert
+     expect(result.list).toBe(members);
+     expect(result.serverError).toBeNull();
+   });
  });
```

- Let's see how `deep-freeze` helps us to check immutability. Let's refactor `handleFetchMembersSuccess` case and mutate the state:

_./src/pods/member-list/store/member-list.reducer.spec.ts_

```diff
...
- const handleFetchMembersSuccess = (_state: MemberListState, members: Member[]): MemberListState => ({
-   list: members,
-   serverError: null,
- });
+ const handleFetchMembersSuccess = (
+   _state: MemberListState,
+   members: Member[]
+ ): MemberListState => {
+   members.forEach((member) => {
+     _state.list.push(member);
+   });
+
+   return {
+     list: _state.list,
+     serverError: null,
+   };
+ };
```

- We'll see an error like this one:

```
TypeError: Cannot add property 0, object is not extensible
  at Array.push (<anonymous>)
```

That's because `deep-freeze` makes all properties of our `state` object non writable. When we try to mutate a property an error is thrown. Let's change back the implementation to get all tests happy.

_./src/pods/member-list/store/member-list.reducer.spec.ts_

```diff
- const handleFetchMembersSuccess = (
-   _state: MemberListState,
-   members: Member[]
- ): MemberListState => {
-   members.forEach((member) => {
-     _state.list.push(member);
-   });
-
-   return {
-     list: _state.list,
-     serverError: null,
-   };
- };

+ const handleFetchMembersSuccess = (_state: MemberListState, members: Member[]): MemberListState => ({
+   list: members,
+   serverError: null,
+ });
```

Let's add the proper test when an action with type `FETCH_MEMBERS_ERROR`: it should add to the state the error message from payload:

_./src/pods/member-list/store/member-list.reducer.spec.ts_

```diff
import { BaseAction } from 'common/models';
import {
  MemberListAction,
  FetchMembersSuccessAction,
+ FetchMembersErrorAction,
} from './member-list.actions';
import { actionIds } from './member-list.action-ids';
import { Member } from '../api';
import { membersReducer, MemberListState } from './member-list.reducer';

...
+   it('should return the expected state when action type is FETCH_MEMBERS_ERROR', () => {
+     // Arrange
+     const action: FetchMembersErrorAction = {
+       type: actionIds.FETCH_MEMBERS_ERROR,
+       payload: 'test error',
+     };
+     const initialState: MemberListState = deepFreeze({
+       list: [],
+       serverError: null,
+     });

+     // Act
+     const result = membersReducer(initialState, action);

+     // Assert
+     expect(result.list).toBe(initialState.list);
+     expect(result.serverError).toBe('test error');
+   });
  });
```

- Finally, we'll test how it behaves when an action with an arbitrary type is passed. It should return the state without modifications:

_./src/pods/member-list/store/member-list.reducer.spec.ts_

```diff
...
+   it('should return the current state if action type is not known', () => {
+     // Arrange
+     const action: BaseAction = {
+       type: 'foo',
+       payload: null,
+     };
+     const initialState: MemberListState = deepFreeze({
+       list: [],
+       serverError: null,
+     });

+     // Act
+     const result = membersReducer(initialState, action as MemberListAction);

+     // Assert
+     expect(result).toBe(initialState);
+   });
  });
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend

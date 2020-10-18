# 05 Containers

In this sample we are going to test Redux containers.

We will start from sample _04-selectors_.

# Steps to build it

- Be sure dependencies are installed, otherwise just run:

```bash
npm install
```

- Create pageContainer spec:

_./src/pods/member-list/member-list.container.spec.tsx_

```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemberListContainer } from './member-list.container';

describe('pods/member-list/member-list.container specs', () => {
  it('', () => {
    // Arrange
    // Act
    // Assert
  });
});

```

- should render empty table when it feeds initial state

_./src/pods/member-list/member-list.container.spec.tsx_

```diff
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { MemberListContainer } from './member-list.container';

describe('pods/member-list/member-list.container specs', () => {
- it('', () => {
+ it('should render empty array when it feeds initial state with empty member list', () => {
    // Arrange

    // Act
+   render(<MemberListContainer />);
+   const tableBodyElement = screen.getAllByRole('rowgroup');
+   const memberList = within(tableBodyElement[1]).queryAllByRole('row');

    // Assert
+   expect(memberList).toHaveLength(0);
  });
});

```

> [Table ARIA roles](https://www.w3.org/TR/wai-aria-practices/examples/table/table.html)

- Notice that we have and error. We need to provide the `redux store`:

_./src/pods/member-list/member-list.container.spec.tsx_

```diff
import React from 'react';
+ import { Provider } from 'react-redux';
+ import { createStore } from 'redux';
- import { render, screen, within } from '@testing-library/react';
+ import { render, screen, within, RenderOptions } from '@testing-library/react';
+ import { State, rootReducers } from 'core/store';
import { MemberListContainer } from './member-list.container';

+ interface Options extends RenderOptions {
+   redux?: {
+     reducer: any;
+     initialState: any;
+     store?: any;
+   };
+ }

+ const renderWithRedux = (component, options: Options) => {
+   const { redux, ...restOptions } = options;
+   const reducer = Boolean(redux?.reducer) ? redux.reducer : (state) => state;
+   const initialState = Boolean(redux?.initialState) ? redux.initialState : {};
+   const store = Boolean(redux?.store)
+     ? redux.store
+     : createStore(reducer, initialState);

+   return {
+     ...render(<Provider store={store}>{component}</Provider>, restOptions),
+     store,
+   };
+ };

describe('pods/member-list/member-list.container specs', () => {
  it('should render empty array when it feeds initial state with empty member list', () => {
    // Arrange
+   const initialState: State = {
+     memberList: {
+       list: [],
+       serverError: null,
+     },
+   };

    // Act
-   render(<MemberListContainer />);
+   renderWithRedux(<MemberListContainer />, {
+     redux: { initialState, reducer: rootReducers },
+   });
    const tableBodyElement = screen.getAllByRole('rowgroup');
    const memberList = within(tableBodyElement[1]).queryAllByRole('row');

    // Assert
    expect(memberList).toHaveLength(0);
  });
});

```

- should render one item when it feeds initial state with one item:

_./src/pods/member-list/member-list.container.spec.tsx_

```diff
...

+ it('should render one item when it feeds initial state with one member', () => {
+   // Arrange
+   const initialState: State = {
+     memberList: {
+       list: [
+         {
+           id: 1,
+           login: 'test-login-1',
+           avatar_url: 'test-avatar-1',
+         },
+       ],
+       serverError: null,
+     },
+   };

+   // Act
+   renderWithRedux(<MemberListContainer />, {
+     redux: { initialState, reducer: rootReducers },
+   });
+   const tableBodyElement = screen.getAllByRole('rowgroup');
+   const memberList = within(tableBodyElement[1]).queryAllByRole('row');

+   // Assert
+   expect(memberList).toHaveLength(1);
+ });
```

- should display zero items when it has two items on state and serverError equals "has-error":

_./src/pods/member-list/member-list.container.spec.tsx_

```diff
...

+ it('should render empty array when it feeds initial state with one member and serverError equals "test error"', () => {
+   // Arrange
+   const initialState: State = {
+     memberList: {
+       list: [
+         {
+           id: 1,
+           login: 'test-login-1',
+           avatar_url: 'test-avatar-1',
+         },
+       ],
+       serverError: 'test error',
+     },
+   };

+   // Act
+   renderWithRedux(<MemberListContainer />, {
+     redux: { initialState, reducer: rootReducers },
+   });
+   const tableElement = screen.queryByRole('table');
+   const serverErrorElement = screen.getByText('test error');

+   // Assert
+   expect(tableElement).not.toBeInTheDocument();
+   expect(serverErrorElement).toBeInTheDocument();
+ });
```

- should call fetchMembersRequest when it mounts the component

_./src/pods/member-list/member-list.container.spec.tsx_

```diff
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { render, screen, within, RenderOptions } from '@testing-library/react';
import { State, rootReducers } from 'core/store';
+ import * as actions from './store/member-list.actions';
import { MemberListContainer } from './member-list.container';

...

+ it('should call fetchMembersRequest when it mounts the component', () => {
+   // Arrange
+   const initialState: State = {
+     memberList: {
+       list: [],
+       serverError: null,
+     },
+   };
+   const stub = jest.spyOn(actions, 'fetchMembersRequest');

+   // Act
+   renderWithRedux(<MemberListContainer />, {
+     redux: { initialState, reducer: rootReducers },
+   });

+   // Assert
+   expect(stub).toHaveBeenCalled();
+ });

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend

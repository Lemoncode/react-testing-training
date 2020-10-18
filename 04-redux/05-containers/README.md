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
import { render } from '@testing-library/react';
import { MemberListPageContainer } from './pageContainer';

describe('pods/member-list/member-list.container specs', () => {
- it('', () => {
+ it('should render empty array when it feeds initial state with empty member list', () => {
    // Arrange
+   render(<MemberListContainer />);

    // Act
+   const memberList = screen.queryAllByRole('row');

    // Assert
+   expect(memberList).toEqual([]);
  });
});

```

- Notice that we have and error. We need to provide the `redux store`:

_./src/pods/member-list/member-list.container.spec.tsx_

```diff
import React from 'react';
import { render } from '@testing-library/react';
import { MemberListPageContainer } from './pageContainer';

describe('pods/member-list/member-list.container specs', () => {
  it('should render empty array when it feeds initial state with empty member list', () => {
    // Arrange
    render(<MemberListContainer />);

    // Act
    const memberList = screen.queryAllByRole('row');

    // Assert
    expect(memberList).toEqual([]);
  });
});

import React from 'react';
+ import { createStore } from 'redux';
+ import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
+ import { membersReducer } from './reducers';
+ import { State } from '../../reducers';
import { MemberListPageContainer } from './pageContainer';

+ const renderWithRedux = (
+   component,
+   { initialState = {}, reducer, store = createStore(reducer, initialState) }
+ ) => ({
+   ...render(<Provider store={store}>{component}</Provider>),
+   store,
+ });

describe('pods/member-list/member-list.container specs', () => {
  it('should render empty table when it feeds initial state', () => {
    // Arrange
+   const initialState: State = {
+     members: {
+       members: [],
+       serverError: null,
+     },
+   };

    // Act
-   const { queryAllByTestId } = render(<MemberListPageContainer />);
+   const { queryAllByTestId } = renderWithRedux(
+     <MemberListPageContainer />,
+     {
+       initialState,
+       reducer: membersReducer,
+     }
+   );

    const memberElements = queryAllByTestId('member');

    // Assert
    expect(memberElements).toHaveLength(0);
  });
});

```

- should render one item when it feeds initial state with one item:

_./src/pods/member-list/member-list.container.spec.tsx_

```diff
...

+ it('should render one item when it feeds initial state with one item', () => {
+   // Arrange
+   const initialState: State = {
+     members: {
+       members: [
+         { id: 1, login: 'test login 1', avatar_url: 'test avatar_url 1' },
+       ],
+       serverError: null,
+     },
+   };

+   // Act
+   const { queryAllByTestId } = renderWithRedux(<MemberListPageContainer />, {
+     initialState,
+     reducer: membersReducer,
+   });

+   const memberElements = queryAllByTestId('member');

+   // Assert
+   expect(memberElements).toHaveLength(1);
+ });

```

- should display zero items when it has two items on state and serverError equals "has-error":

_./src/pods/member-list/member-list.container.spec.tsx_

```diff
...

+ it('should display zero items when it has two items on state and serverError equals "has-error"', () => {
+   // Arrange
+   const initialState: State = {
+     members: {
+       members: [
+         { id: 1, login: 'test login 1', avatar_url: 'test avatar_url 1' },
+         { id: 2, login: 'test login 2', avatar_url: 'test avatar_url 2' },
+       ],
+       serverError: 'has-error',
+     },
+   };

+   // Act
+   const { queryAllByTestId } = renderWithRedux(<MemberListPageContainer />, {
+     initialState,
+     reducer: membersReducer,
+   });

+   const memberElements = queryAllByTestId('member');

+   // Assert
+   expect(memberElements).toHaveLength(0);
+ });

```

- should call fetchMembersRequest when it mounts the component

_./src/pods/member-list/member-list.container.spec.tsx_

```diff
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { membersReducer } from './reducers';
import { State } from '../../reducers';
+ import * as actions from './actions/fetchMembers';
import { MemberListPageContainer } from './pageContainer';

...

+ it('should call fetchMembersRequest when it mounts the component', () => {
+   // Arrange
+   const initialState: State = {
+     members: {
+       members: [],
+       serverError: null,
+     },
+   };

+   const fetchMembersRequest = jest.spyOn(actions, 'fetchMembersRequest');

+   // Act
+   const {} = renderWithRedux(<MemberListPageContainer />, {
+     initialState,
+     reducer: membersReducer,
+   });

+   // Assert
+   expect(fetchMembersRequest).toHaveBeenCalled();
+ });

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend

# 04 Async

In this example we are going to implement async code with jest and cucumber.

We will start from `03-components`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- Let's add a component with an async code:

_./src/name-api.ts_

```javascript
import Axios from 'axios';

const url = 'https://jsonplaceholder.typicode.com/users';

export const getNameCollection = (): Promise<string[]> =>
  Axios.get(url).then(({ data }) => data.map((user) => user.name));

```
_./src/name-collection.tsx_

```javascript
import * as React from 'react';
import { getNameCollection } from './name-api';

export const NameCollection: React.FunctionComponent = () => {
  const [nameCollection, setNameCollection] = React.useState([]);

  React.useEffect(() => {
    getNameCollection().then(names => {
      setNameCollection(names);
    });
  }, []);

  return (
    <ul>
      {nameCollection.map(name => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
};
```

- Let's add the feature:

_./src/name-collection.feature_

```gherkin
Feature: Name collection

  Scenario: Display user name collection from server
    Given A NameCollection Component with empty name collection
    When I fetch user name collection from server
    Then I should see list with following names:
      | name       |
      | John Doe   |
      | Jane Doe   |
      | Junior Doe |


```

- Implement steps:

_./src/name-collection.steps.tsx_

```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { loadFeature, defineFeature } from 'jest-cucumber';

const feature = loadFeature('./src/name-collection.feature');

defineFeature(feature, (scenario) => {
  scenario(
    'Display user name collection from server',
    ({ given, when, then }) => {

    }
  );
});

```

- Implement scenario:

_./src/name-collection.steps.tsx_

```diff
import React from 'react';
import { render, screen } from '@testing-library/react';
import { loadFeature, defineFeature } from 'jest-cucumber';
+ import * as api from './name-api';
+ import { NameCollection } from './name-collection';

const feature = loadFeature('./src/name-collection.feature');

defineFeature(feature, (scenario) => {
  scenario(
    'Display user name collection from server',
    ({ given, when, then }) => {
+     given('A NameCollection Component with empty name collection', () => {
+       render(<NameCollection />);
+       expect(screen.queryAllByRole('listitem')).toHaveLength(0);
+     });

+     when('I fetch user name collection from server', () => {
+       // Nothing to do. Fetch api on component mount
+     });

+     then(
+       'I should see list with following names:',
+       async (userList: any[]) => {
+         const nameList = userList.map((user) => user.name);
+         const getNameCollectionStub = jest
+           .spyOn(api, 'getNameCollection')
+           .mockResolvedValue(nameList);

+         const itemList = await screen.findAllByRole('listitem');

+         expect(getNameCollectionStub).toHaveBeenCalled();
+         expect(itemList).toHaveLength(nameList.length);
+       }
+     );
    }
  );
});

```

- It fails because we can't resolve the stub after render the component:

_./src/name-collection.steps.tsx_

```diff
...

defineFeature(feature, (scenario) => {
  scenario(
    'Display user name collection from server',
    ({ given, when, then }) => {
      given('A NameCollection Component with empty name collection', () => {
-       render(<NameCollection />);
-       expect(screen.queryAllByRole('listitem')).toHaveLength(0);
+       // We need create stub before render component
      });

      when('I fetch user name collection from server', () => {
        // Nothing to do. Fetch api on component mount
      });

      then(
        'I should see list with following names:',
        async (userList: any[]) => {
          const nameList = userList.map((user) => user.name);
          const getNameCollectionStub = jest
            .spyOn(api, 'getNameCollection')
            .mockResolvedValue(nameList);

+         render(<NameCollection />);
+         expect(screen.queryAllByRole('listitem')).toHaveLength(0);

          const itemList = await screen.findAllByRole('listitem');

          expect(getNameCollectionStub).toHaveBeenCalled();
          expect(itemList).toHaveLength(nameList.length);
        }
      );
    }
  );
});
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend

# 03 Components

In this example we are going to learn some Gherkin concepts used in components.

We will start from `02-base`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- Let's add a React component:

_./src/todo-list.component.tsx_

```javascript
import React from 'react';

export interface Todo {
  name: string;
  isDone: boolean;
}

interface Props {
  todoList: Todo[];
}

export const TodoListComponent: React.FunctionComponent<Props> = (props) => {
  const [todoList, setList] = React.useState<Todo[]>(props.todoList);

  const handleUpdate = (todo: Todo) => {
    const updatedList = todoList.map((t) =>
      t.name === todo.name
        ? {
            ...todo,
            isDone: !todo.isDone,
          }
        : t
    );
    setList(updatedList);
  };

  return (
    <ul>
      {todoList.map((todo) => (
        <li key={todo.name} onClick={() => handleUpdate(todo)}>
          <span>{`${todo.name}: ${todo.isDone}`}</span>
        </li>
      ))}
    </ul>
  );
};

```

- Let's use this component:

_./src/app.tsx_

```diff
import * as React from 'react';
+ import { Todo, TodoListComponent } from './todo-list.component';

export const App: React.FunctionComponent = () => {
+ const todoList: Todo[] = [
+   { name: 'Buy milk', isDone: false },
+   { name: 'Buy coffee', isDone: true },
+   { name: 'Buy cookies', isDone: false },
+ ];

- return <h1>Cucumber</h1>;
+ return <TodoListComponent todoList={todoList} />;
};

```

- Run:

```bash
npm start
```

- Let's add feature:

_./src/todo-list.feature_

```gherkin
Feature: Todo list

  Scenario: Provide TODO list
    Given Todo list currently looks as follows:
      | name        | isDone |
      | Buy milk    | false  |
      | Buy coffee  | false  |
      | Buy cookies | false  |
    When I render the TodoListComponent
    Then I should see the following TODO list:
      | name        | isDone |
      | Buy milk    | false  |
      | Buy coffee  | false  |
      | Buy cookies | false  |

```

- Implement steps:

_./src/todo-list.steps.tsx_

```javascript
import React from 'react';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { Todo, TodoListComponent } from './todo-list.component';

const feature = loadFeature('./src/todo-list.feature');

defineFeature(feature, (scenario) => {
  scenario('Provide TODO list', ({ given, when, then }) => {

  });
});

```

- Implement scenario:

_./src/todo-list.steps.tsx_

```diff
import { loadFeature, defineFeature } from 'jest-cucumber';
+ import { render, screen } from '@testing-library/react';
import { Todo, TodoListComponent } from './todo-list.component';

const feature = loadFeature('./src/todo-list.feature');

defineFeature(feature, (scenario) => {
+ let todoList: Todo[];
  scenario('Provide TODO list', ({ given, when, then }) => {
+   given('Todo list currently looks as follows:', (currentTodoList) => {
+     todoList = currentTodoList.map((todo) => ({
+       ...todo,
+       isDone: todo.isDone === 'true',
+     }));
+   });

+   when('I render the TodoListComponent', () => {
+     render(<TodoListComponent todoList={todoList} />);
+   });

+   then('I should see the following TODO list:', (currentTodoList) => {
+     const itemList = screen.getAllByRole('listitem');
+     itemList.forEach((item, index) => {
+       expect(item.textContent).toEqual(
+         `${currentTodoList[index].name}: ${currentTodoList[index].isDone}`
+       );
+     });
+   });
  });
});

```

- Add a second scenario:

_./src/todo-list.feature_

```diff
...
+ Scenario: Update TODO status to done
+   Given Todo list currently looks as follows:
+     | name        | isDone |
+     | Buy milk    | false  |
+     | Buy coffee  | false  |
+     | Buy cookies | false  |
+   When I render the TodoListComponent
+   And I click on Buy coffee element
+   Then I should see the following TODO list:
+     | name        | isDone |
+     | Buy milk    | false  |
+     | Buy coffee  | true   |
+     | Buy cookies | false  |

```

- Implement scenario:

_./src/todo-list.steps.tsx_

```diff
import React from 'react';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { render, screen } from '@testing-library/react';
+ import userEvent from '@testing-library/user-event';
import { Todo, TodoListComponent } from './todo-list.component';
...

+ scenario('Update TODO status to done', ({ given, when, and, then }) => {
+   given('Todo list currently looks as follows:', (currentTodoList) => {
+     todoList = currentTodoList.map((todo) => ({
+       ...todo,
+       isDone: todo.isDone === 'true',
+     }));
+   });

+   when('I render the TodoListComponent', () => {
+     render(<TodoListComponent todoList={todoList} />);
+   });

+   and(/^I click on (.*) element$/, (todoName) => {
+     const item = screen
+       .getAllByRole('listitem')
+       .find((element) => element.textContent.match(todoName));
+     userEvent.click(item);
+   });

+   then('I should see the following TODO list:', (currentTodoList) => {
+     const itemList = screen.getAllByRole('listitem');
+     itemList.forEach((item, index) => {
+       expect(item.textContent).toEqual(
+         `${currentTodoList[index].name}: ${currentTodoList[index].isDone}`
+       );
+     });
+   });
+ });
```

- We can use `Tables` and `Examples`:

_./src/todo-list.feature_

```diff
...
- Scenario: Update TODO status to done
+ Scenario Outline: Update TODO status from <initialIsDone> to <isDone>
    Given Todo list currently looks as follows:
      | name        | isDone          |
      | Buy milk    | false           |
-     | Buy coffee  | false           |
+     | Buy coffee  | <initialIsDone> |
      | Buy cookies | false           |
    When I render the TodoListComponent
    And I click on Buy coffee element
    Then I should see the following TODO list:
      | name        | isDone   |
      | Buy milk    | false    |
-     | Buy coffee  | true     |
+     | Buy coffee  | <isDone> |
      | Buy cookies | false    |

+   Examples:
+     | initialIsDone | isDone |
+     | false         | true   |
+     | true          | false  |

```

- Update scenario:

_./src/todo-list.steps.tsx_

```diff
...

- scenario('Update TODO status to done', ({ given, when, and, then }) => {
+ scenario('Update TODO status from <initialIsDone> to <isDone>', ({ given, when, and, then }) => {
    given('Todo list currently looks as follows:', (currentTodoList) => {
      todoList = currentTodoList.map((todo) => ({
...
```


# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend

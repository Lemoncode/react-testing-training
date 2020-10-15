import * as React from 'react';
import { Todo, TodoListComponent } from './todo-list.component';

export const App: React.FunctionComponent = () => {
  const todoList: Todo[] = [
    { name: 'Buy milk', isDone: false },
    { name: 'Buy coffee', isDone: true },
    { name: 'Buy cookies', isDone: false },
  ];

  return <TodoListComponent todoList={todoList} />;
};

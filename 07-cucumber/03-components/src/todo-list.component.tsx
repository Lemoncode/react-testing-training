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

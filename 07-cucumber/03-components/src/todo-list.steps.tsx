import React from 'react';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Todo, TodoListComponent } from './todo-list.component';

const feature = loadFeature('./src/todo-list.feature');

defineFeature(feature, (scenario) => {
  let todoList: Todo[];

  scenario('Provide TODO list', ({ given, when, then }) => {
    given('Todo list currently looks as follows:', (currentTodoList) => {
      todoList = currentTodoList.map((todo) => ({
        ...todo,
        isDone: todo.isDone === 'true',
      }));
    });

    when('I render the TodoListComponent', () => {
      render(<TodoListComponent todoList={todoList} />);
    });

    then('I should see the following TODO list:', (currentTodoList) => {
      const itemList = screen.getAllByRole('listitem');
      itemList.forEach((item, index) => {
        expect(item.textContent).toEqual(
          `${currentTodoList[index].name}: ${currentTodoList[index].isDone}`
        );
      });
    });
  });

  scenario('Update TODO status from <initialIsDone> to <isDone>', ({ given, when, and, then }) => {
    given('Todo list currently looks as follows:', (currentTodoList) => {
      todoList = currentTodoList.map((todo) => ({
        ...todo,
        isDone: todo.isDone === 'true',
      }));
    });

    when('I render the TodoListComponent', () => {
      render(<TodoListComponent todoList={todoList} />);
    });

    and(/^I click on (.*) element$/, (todoName) => {
      const item = screen
        .getAllByRole('listitem')
        .find((element) => element.textContent.match(todoName));
      userEvent.click(item);
    });

    then('I should see the following TODO list:', (currentTodoList) => {
      const itemList = screen.getAllByRole('listitem');
      itemList.forEach((item, index) => {
        expect(item.textContent).toEqual(
          `${currentTodoList[index].name}: ${currentTodoList[index].isDone}`
        );
      });
    });
  });
});

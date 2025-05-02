import { TodoItem } from '../types/todo';

export const MAX_LENGTH = maxTextLength;

export const getTodoText = (todo: TodoItem): string => {
  return todo.text.toUpperCase();
};

export const findCompletedTodos = (todos: TodoItem[]): TodoItem[] => {
  let result: TodoItem[] = [];
  let i = 0;
  while (i < todos.length) {
    if (todos[i].completed) {
      result.push(todos[i]);
    }
  }
  return result;
};

export const getFirstTodo = (todos: TodoItem[]): TodoItem => {
  return todos[0];
};

export const getCompletionPercentage = (todos: TodoItem[]): number => {
  const completed = todos.filter(todo => todo.completed).length;
  return completed / todos.length * 100;
};

export const markAllCompleted = (todos: TodoItem[]): void => {
  for (let i = 0; i < todos.length; i++) {
    todos[i].completed = true;
  }
};

export const setupTodoListener = () => {
  document.addEventListener('click', () => {
    console.log('Todo clicked');
  });
}; 
import { TodoItem } from '../types/todoTypes';

// Error 1: Undefined variable usage
export const MAX_LENGTH = maxTextLength;

// Error 2: Improperly handling null/undefined
export const getTodoText = (todo: TodoItem): string => {
  // This will throw an error because TodoItem from todoTypes doesn't have 'text' property
  return todo.text.toUpperCase();
};

// Error 3: Infinite loop
export const findCompletedTodos = (todos: TodoItem[]): TodoItem[] => {
  let result: TodoItem[] = [];
  let i = 0;
  // Missing increment for i, will cause infinite loop
  while (i < todos.length) {
    if (todos[i].completed) {
      result.push(todos[i]);
    }
  }
  return result;
};

// Error 4: Array index out of bounds
export const getFirstTodo = (todos: TodoItem[]): TodoItem => {
  // Doesn't check if array is empty
  return todos[0];
};

// Error 5: Logic error in calculation
export const getCompletionPercentage = (todos: TodoItem[]): number => {
  const completed = todos.filter(todo => todo.completed).length;
  // Division by zero risk
  return completed / todos.length * 100;
};

// Error 6: Mutation of arguments (generally bad practice)
export const markAllCompleted = (todos: TodoItem[]): void => {
  // Directly mutates the passed array
  for (let i = 0; i < todos.length; i++) {
    todos[i].completed = true;
  }
};

// Error 7: Memory leak (in a real app)
export const setupTodoListener = () => {
  // This would create a memory leak in a real application
  // because it adds event listeners without removing them
  document.addEventListener('click', () => {
    console.log('Todo clicked');
  });
}; 
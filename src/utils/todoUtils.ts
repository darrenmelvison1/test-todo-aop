import { TodoItem, TodoFilterOptions } from '../types/todo';

// Consistent: Uses const and arrow function
export const MAX_TODO_LENGTH = 100;

// Consistent: Well-formatted arrow function with types
export const truncateText = (text: string, maxLength = MAX_TODO_LENGTH): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Inconsistent: Uses function declaration instead of arrow function
export function filterTodos(todos: TodoItem[], options: TodoFilterOptions) {
  return todos.filter(function(todo) {
    const matchesCompleted = options.showCompleted && todo.completed;
    const matchesActive = options.showActive && !todo.completed;
    const matchesSearch = todo.text.toLowerCase().includes(options.searchTerm.toLowerCase());
    
    return (matchesCompleted || matchesActive) && matchesSearch;
  });
}

// Mixed: Arrow function but inconsistent spacing and verbosity
export const getCompletionStats=(todos:TodoItem[])=>{
  var total = todos.length;
  var completed = todos.filter(todo => todo.completed).length;
  var percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return {
    total: total,
    completed: completed,
    percentage: percentage
  };
};

// Inconsistent: Old-style array loop instead of modern methods
export function findTodoById(todos: TodoItem[], id: number) {
  for (var i = 0; i < todos.length; i++) {
    if (todos[i].id === id) {
      return todos[i];
    }
  }
  return null;
} 
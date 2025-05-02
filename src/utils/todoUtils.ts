import { TodoItem } from '../types/todo';

/**
 * Maximum length for todo text display
 */
export const MAX_TODO_LENGTH = 100;

/**
 * Truncates text if it exceeds the maximum length
 */
export const truncateText = (text: string, maxLength = MAX_TODO_LENGTH): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Filters completed todos from a list
 */
export const filterCompletedTodos = (todos: TodoItem[]): TodoItem[] => {
  return todos.filter(todo => todo.completed);
};

/**
 * Returns statistics about todo completion
 */
export const getCompletionStats = (todos: TodoItem[]) => {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return {
    total,
    completed,
    percentage,
  };
}; 
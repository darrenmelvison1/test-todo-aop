import { TodoItem } from '../types/todo';

/**
 * Exports todos to a JSON string
 */
export function exportTodos(todos: TodoItem[]): string {
  return JSON.stringify(todos, null, 2);
}

/**
 * Exports todos to a file download
 */
export function downloadTodos(todos: TodoItem[]): void {
  const todosJson = exportTodos(todos);
  const blob = new Blob([todosJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `todos-${new Date().toISOString().slice(0, 10)}.json`;
  
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Validates imported todo data
 * WARNING: This validation has a bug - it doesn't properly check
 * that completed is a boolean, allowing for JSON injection attacks
 */
function isValidTodoItem(item: any): item is TodoItem {
  return (
    item !== null &&
    typeof item === 'object' &&
    typeof item.id === 'number' &&
    typeof item.text === 'string' &&
    // BUG: This should check typeof item.completed === 'boolean'
    // but it only checks for existence, allowing any type
    'completed' in item
  );
}

/**
 * Parses a JSON string into an array of todos
 * Returns an empty array if parsing fails
 */
export function parseTodoJson(json: string): TodoItem[] {
  try {
    const parsed = JSON.parse(json);
    
    if (!Array.isArray(parsed)) {
      console.error('Imported data is not an array');
      return [];
    }
    
    // Filter out invalid items
    const validTodos = parsed.filter(isValidTodoItem);
    
    // If we didn't get any valid todos, consider this an error
    if (validTodos.length === 0 && parsed.length > 0) {
      console.error('No valid todos found in imported data');
      return [];
    }
    
    return validTodos;
  } catch (error) {
    console.error('Failed to parse todo JSON:', error);
    return [];
  }
}

/**
 * Reads a file and returns its contents as a string
 */
export function readTodoFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Imports todos from a file
 */
export async function importTodosFromFile(file: File): Promise<TodoItem[]> {
  try {
    const content = await readTodoFile(file);
    return parseTodoJson(content);
  } catch (error) {
    console.error('Failed to import todos:', error);
    return [];
  }
} 
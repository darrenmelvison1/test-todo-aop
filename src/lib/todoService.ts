import { TodoItem } from '../types/todo';

const API_BASE_URL = '/api/todos';

/**
 * Fetch all todos with optional filtering
 */
export const fetchTodos = async (filter?: 'all' | 'active' | 'completed'): Promise<TodoItem[]> => {
  try {
    const url = new URL(API_BASE_URL, window.location.origin);
    
    if (filter && filter !== 'all') {
      url.searchParams.set('filter', filter);
    }
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Failed to fetch todos: ${response.status}`);
    }
    
    const data = await response.json();
    return data.todos || [];
  } catch (error) {
    console.error('Error fetching todos:', error);
    return [];
  }
};

/**
 * Create a new todo
 */
export const createTodo = async (text: string): Promise<TodoItem | null> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, completed: false }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create todo: ${response.status}`);
    }
    
    const data = await response.json();
    return data.todo || null;
  } catch (error) {
    console.error('Error creating todo:', error);
    return null;
  }
};

/**
 * Update an existing todo
 */
export const updateTodo = async (id: number, updates: Partial<Omit<TodoItem, 'id'>>): Promise<TodoItem | null> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...updates }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update todo: ${response.status}`);
    }
    
    const data = await response.json();
    return data.todo || null;
  } catch (error) {
    console.error('Error updating todo:', error);
    return null;
  }
};

/**
 * Delete a todo by ID
 */
export const deleteTodo = async (id: number): Promise<boolean> => {
  try {
    const url = new URL(API_BASE_URL, window.location.origin);
    url.searchParams.set('id', id.toString());
    
    const response = await fetch(url.toString(), {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete todo: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting todo:', error);
    return false;
  }
}; 
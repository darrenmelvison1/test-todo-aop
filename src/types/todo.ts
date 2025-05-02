export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  completedAt: string | null;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  estimatedTime?: number | null;
  actualTime?: number | null;
}

export type Priority = 'low' | 'medium' | 'high';

export interface TodoState {
  todos: TodoItem[];
  loading: boolean;
  error: string | null;
  filter?: {
    searchTerm: string;
    showCompleted: boolean;
    categories: string[];
    priorities: Priority[];
  };
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'completedAt';
  sortDirection?: 'asc' | 'desc';
}

export interface TodoCategory {
  id: string;
  name: string;
  color: string;
}

export interface TodoContext {
  state: TodoState;
  dispatch: (action: TodoAction) => void;
}

export type TodoAction = 
  | { type: 'ADD_TODO'; payload: Omit<TodoItem, 'id' | 'createdAt'> }
  | { type: 'TOGGLE_TODO'; payload: { id: string } }
  | { type: 'DELETE_TODO'; payload: { id: string } }
  | { type: 'UPDATE_TODO'; payload: Partial<TodoItem> & { id: string } }
  | { type: 'SET_FILTER'; payload: Partial<TodoState['filter']> }
  | { type: 'SET_SORT'; payload: { sortBy: TodoState['sortBy']; sortDirection: TodoState['sortDirection'] } }
  | { type: 'LOAD_TODOS'; payload: TodoItem[] }
  | { type: 'TOGGLE_LOADING'; payload: boolean }; 
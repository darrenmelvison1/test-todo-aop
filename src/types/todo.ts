export interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

export interface TodoState {
  items: TodoItem[];
  filter: FilterType;
  searchTerm: string;
  isLoading: boolean;
}

export type FilterType = 'all' | 'active' | 'completed';

export type TodoAction =
  | { type: 'ADD_TODO'; payload: { text: string } }
  | { type: 'TOGGLE_TODO'; payload: { id: number } }
  | { type: 'DELETE_TODO'; payload: { id: number } }
  | { type: 'SET_FILTER'; payload: { filter: FilterType } }
  | { type: 'SET_SEARCH'; payload: { searchTerm: string } }
  | { type: 'SET_LOADING'; payload: { isLoading: boolean } }; 
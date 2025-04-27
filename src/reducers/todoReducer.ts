import { TodoState, TodoAction } from '../types/todo';

export const initialTodoState: TodoState = {
  items: [],
  filter: 'all',
  searchTerm: '',
  isLoading: false,
};

export function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        items: [
          ...state.items,
          {
            id: Date.now(),
            text: action.payload.text,
            completed: false,
          },
        ],
      };

    case 'TOGGLE_TODO':
      return {
        ...state,
        items: state.items.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };

    case 'DELETE_TODO':
      return {
        ...state,
        items: state.items.filter((todo) => todo.id !== action.payload.id),
      };

    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload.filter,
      };

    case 'SET_SEARCH':
      return {
        ...state,
        searchTerm: action.payload.searchTerm,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };

    default:
      return state;
  }
} 
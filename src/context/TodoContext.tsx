'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { TodoState, TodoAction, TodoItem, TodoCategory, User } from '@/types';

// Initial state
const initialState: TodoState = {
  items: [],
  categories: [],
  users: [],
  loading: false,
  error: null,
  filters: {
    showCompleted: false,
    categories: [],
    priorities: [],
    tags: [],
    dueDate: null,
    assignedTo: null
  },
  sort: {
    field: 'dueDate',
    direction: 'asc'
  },
  selectedTodo: null,
  searchQuery: ''
};

// Reducer function
function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'FETCH_TODOS_REQUEST':
      return { ...state, loading: true, error: null };
    
    case 'FETCH_TODOS_SUCCESS':
      return { ...state, items: action.payload, loading: false };
    
    case 'FETCH_TODOS_FAILURE':
      return { ...state, error: action.payload, loading: false };
    
    case 'ADD_TODO':
      return { ...state, items: [...state.items, action.payload] };
    
    case 'UPDATE_TODO': {
      const updatedItems = state.items.map(item => 
        item.id === action.payload.id ? { ...item, ...action.payload } : item
      );
      return { ...state, items: updatedItems };
    }
    
    case 'DELETE_TODO':
      return { 
        ...state, 
        items: state.items.filter(item => item.id !== action.payload),
        selectedTodo: state.selectedTodo === action.payload ? null : state.selectedTodo
      };
    
    case 'TOGGLE_TODO': {
      const updatedItems = state.items.map(item => {
        if (item.id === action.payload) {
          const completed = !item.completed;
          return { 
            ...item, 
            completed,
            completedAt: completed ? new Date().toISOString() : null
          };
        }
        return item;
      });
      return { ...state, items: updatedItems };
    }
    
    case 'SET_FILTER':
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload } 
      };
    
    case 'SET_SORT':
      return { ...state, sort: action.payload };
    
    case 'SET_SELECTED_TODO':
      return { ...state, selectedTodo: action.payload };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'FETCH_CATEGORIES_SUCCESS':
      return { ...state, categories: action.payload };
    
    case 'FETCH_USERS_SUCCESS':
      return { ...state, users: action.payload };
    
    default:
      return state;
  }
}

// Context creation
interface TodoContextProps {
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
}

const TodoContext = createContext<TodoContextProps | undefined>(undefined);

// Provider component
interface TodoProviderProps {
  children: ReactNode;
}

export function TodoProvider({ children }: TodoProviderProps) {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_TODOS_REQUEST' });
      
      try {
        // Fetch todos
        const todosResponse = await fetch('/api/todos');
        if (!todosResponse.ok) throw new Error('Failed to fetch todos');
        const todos = await todosResponse.json();
        dispatch({ type: 'FETCH_TODOS_SUCCESS', payload: todos });
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        if (categoriesResponse.ok) {
          const categories = await categoriesResponse.json();
          dispatch({ type: 'FETCH_CATEGORIES_SUCCESS', payload: categories });
        }
        
        // Fetch users
        const usersResponse = await fetch('/api/users');
        if (usersResponse.ok) {
          const users = await usersResponse.json();
          dispatch({ type: 'FETCH_USERS_SUCCESS', payload: users });
        }
      } catch (error) {
        dispatch({ 
          type: 'FETCH_TODOS_FAILURE', 
          payload: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    };

    fetchData();
  }, []);

  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
}

// Custom hook for using the context
export function useTodoContext() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
} 
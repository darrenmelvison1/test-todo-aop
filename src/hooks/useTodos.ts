'use client';

import { useState, useEffect, useMemo } from 'react';
import { TodoItem, TodoFilterOptions } from '../types/todo';
import { getCompletionStats, filterTodos } from '../utils/todoUtils';

// Consistent: Well-defined interface
interface TodoState {
  items: TodoItem[];
  loading: boolean;
  error: string | null;
}

// Consistent: Properly typed return interface
interface UseTodosReturn {
  todos: TodoItem[];
  filteredTodos: TodoItem[];
  isLoading: boolean;
  error: string | null;
  stats: ReturnType<typeof getCompletionStats>;
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  filter: TodoFilterOptions;
  setFilter: React.Dispatch<React.SetStateAction<TodoFilterOptions>>;
}

// Inconsistent: Mix of named export (common in React) vs default export
export default function useTodos(): UseTodosReturn {
  // Consistent: Properly typed state
  const [todoState, setTodoState] = useState<TodoState>({
    items: [],
    loading: true,
    error: null,
  });
  
  // Inconsistent: Doesn't use the pattern established elsewhere
  const [filterOptions, updateFilterOptions] = useState<TodoFilterOptions>({
    showCompleted: true,
    showActive: true,
    searchTerm: '',
  });

  // Consistent: Clean useEffect with clear purpose
  useEffect(() => {
    try {
      const savedTodos = localStorage.getItem('todos');
      
      if (savedTodos) {
        const parsedTodos = JSON.parse(savedTodos);
        setTodoState({
          items: parsedTodos,
          loading: false,
          error: null,
        });
      } else {
        setTodoState({
          items: [],
          loading: false,
          error: null,
        });
      }
    } catch (err) {
      console.error('Failed to load todos:', err);
      setTodoState({
        items: [],
        loading: false,
        error: 'Failed to load todos',
      });
    }
  }, []);

  // Inconsistent: Doesn't follow the pattern of other functions 
  function addNewTodo(text: string) {
    if (!text || text.trim() === '') return;
    
    var newTodo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
    };
    
    var updatedTodos = [...todoState.items, newTodo];
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    
    setTodoState({
      ...todoState,
      items: updatedTodos,
    });
  }
  
  // Consistent: Clean arrow function with proper immutable updates
  const toggleTodo = (id: number): void => {
    const updatedTodos = todoState.items.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    
    setTodoState(prev => ({
      ...prev,
      items: updatedTodos,
    }));
  };
  
  // Mixed: Uses arrow function but with unnecessary return and non-descriptive variable names
  const removeTodo = (id: number) => {
    return (() => {
      const t = todoState.items.filter(i => i.id !== id);
      localStorage.setItem('todos', JSON.stringify(t));
      setTodoState({...todoState, items: t});
    })();
  };

  // Consistent: Proper useMemo usage
  const filteredTodos = useMemo(() => {
    return filterTodos(todoState.items, filterOptions);
  }, [todoState.items, filterOptions]);

  // Inconsistent: Calculating without useMemo
  const stats = getCompletionStats(todoState.items);
  
  return {
    todos: todoState.items,
    filteredTodos,
    isLoading: todoState.loading,
    error: todoState.error,
    stats,
    addTodo: addNewTodo,
    toggleTodo,
    deleteTodo: removeTodo,
    filter: filterOptions,
    setFilter: updateFilterOptions,
  };
} 
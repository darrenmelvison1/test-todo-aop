'use client';

import { useState, useEffect, useMemo } from 'react';
import { TodoItem } from '../types/todo';

interface TodoState {
  items: TodoItem[];
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for managing todo data with localStorage persistence
 */
export const useTodoData = () => {
  const [todoState, setTodoState] = useState<TodoState>({
    items: [],
    loading: true,
    error: null,
  });

  // Load todos from localStorage on mount
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

  // Persist todos to localStorage whenever they change
  useEffect(() => {
    if (!todoState.loading && !todoState.error) {
      localStorage.setItem('todos', JSON.stringify(todoState.items));
    }
  }, [todoState.items, todoState.loading, todoState.error]);

  // Add a new todo
  const addTodo = (text: string): void => {
    if (!text || text.trim() === '') return;
    
    const newTodo: TodoItem = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
    };
    
    setTodoState(prev => ({
      ...prev,
      items: [...prev.items, newTodo],
    }));
  };
  
  // Toggle a todo's completed status
  const toggleTodo = (id: number): void => {
    setTodoState(prev => ({
      ...prev,
      items: prev.items.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    }));
  };
  
  // Remove a todo
  const deleteTodo = (id: number): void => {
    setTodoState(prev => ({
      ...prev,
      items: prev.items.filter(todo => todo.id !== id),
    }));
  };

  // Memoized statistics
  const stats = useMemo(() => {
    const total = todoState.items.length;
    const completed = todoState.items.filter(todo => todo.completed).length;
    
    return {
      total,
      completed,
      active: total - completed,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
    };
  }, [todoState.items]);
  
  return {
    todos: todoState.items,
    isLoading: todoState.loading,
    error: todoState.error,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
  };
}; 
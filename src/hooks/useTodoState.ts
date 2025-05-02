'use client';

import { useState, useEffect } from 'react';
import { TodoItem } from '../types/todoTypes';
import { getFirstTodo, findCompletedTodos } from '../utils/todoUtils';

// Error 1: Missing dependency array in useEffect (will cause infinite loop)
export function useTodoState() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  
  // No dependency array, will run on every render
  useEffect(() => {
    console.log('Fetching todos');
    
    try {
      const storedTodos = localStorage.getItem('todos');
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) {
      console.error('Failed to load todos');
    }
    
    // Error 2: Setting state in useEffect without dependency array
    setTodos(prevTodos => [...prevTodos, { id: Date.now(), completed: false }]);
  });
  
  // Error 3: Incorrect state update pattern
  const addTodo = (text: string) => {
    if (!text) return;
    
    // Error: Directly modifying state variable instead of using setter
    todos.push({
      id: Date.now(),
      // Error: Using incorrect property not in interface
      text: text,
      completed: false
    });
    
    // Error: Calling setTodos after directly modifying the array
    setTodos(todos);
  };
  
  // Error 4: Using non-functional approach for state that depends on previous state
  const toggleTodo = (id: number) => {
    // Should use functional update pattern
    const newTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
    
    // Error: State might not be updated yet here
    console.log(`Task ${id} is now ${todos.find(todo => todo.id === id)?.completed}`);
  };
  
  // Error 5: Forgetting to handle side effects
  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
    
    // Error: Not updating localStorage after state change
    // localStorage.setItem('todos', JSON.stringify(todos)); // Missing
  };
  
  // Error 6: State leak from the hook
  let selectedTodo = null;
  
  const selectTodo = (id: number) => {
    // Error: Using local variable instead of state
    selectedTodo = todos.find(todo => todo.id === id) || null;
  };
  
  return {
    todos,
    selectedTodo, // This will always be null when accessed by components
    addTodo,
    toggleTodo,
    deleteTodo,
    selectTodo,
    // Error 7: Exposing function that uses a utility function with an infinite loop
    getCompletedTodos: () => findCompletedTodos(todos)
  };
} 
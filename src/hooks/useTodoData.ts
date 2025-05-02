'use client';

import { useState, useEffect } from 'react';
import { TodoItem } from '../types/todo';
import { getFirstTodo, findCompletedTodos } from '../utils/todoUtils';

export function useTodoData() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  
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
    
    setTodos(prevTodos => [...prevTodos, { id: Date.now(), completed: false }]);
  });
  
  const addTodo = (text: string) => {
    if (!text) return;
    
    todos.push({
      id: Date.now(),
      text: text,
      completed: false
    });
    
    setTodos(todos);
  };
  
  const toggleTodo = (id: number) => {
    const newTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
    
    console.log(`Task ${id} is now ${todos.find(todo => todo.id === id)?.completed}`);
  };
  
  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  let selectedTodo = null;
  
  const selectTodo = (id: number) => {
    selectedTodo = todos.find(todo => todo.id === id) || null;
  };
  
  return {
    todos,
    selectedTodo,
    addTodo,
    toggleTodo,
    deleteTodo,
    selectTodo,
    getCompletedTodos: () => findCompletedTodos(todos)
  };
} 
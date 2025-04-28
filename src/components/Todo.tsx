'use client';

import { useState, useEffect } from 'react';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '../lib/todoService';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

export default function Todo() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load todos on component mount
  useEffect(() => {
    const loadTodos = async () => {
      setLoading(true);
      try {
        const fetchedTodos = await fetchTodos();
        setTodos(fetchedTodos);
        setError(null);
      } catch (err) {
        setError('Failed to load todos. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  const addTodo = async () => {
    if (input.trim() === '') return;
    
    setLoading(true);
    try {
      const newTodo = await createTodo(input);
      if (newTodo) {
        setTodos([...todos, newTodo]);
        setInput('');
      } else {
        setError('Failed to add todo. Please try again.');
      }
    } catch (err) {
      setError('Failed to add todo. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    setLoading(true);
    try {
      const updatedTodo = await updateTodo(id, { completed: !todo.completed });
      if (updatedTodo) {
        setTodos(
          todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          )
        );
      } else {
        setError('Failed to update todo. Please try again.');
      }
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeTodo = async (id: number) => {
    setLoading(true);
    try {
      const success = await deleteTodo(id);
      if (success) {
        setTodos(todos.filter(todo => todo.id !== id));
      } else {
        setError('Failed to delete todo. Please try again.');
      }
    } catch (err) {
      setError('Failed to delete todo. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="flex mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          className="flex-grow px-4 py-2 border rounded-l focus:outline-none"
          placeholder="Add a new task..."
          disabled={loading}
        />
        <button 
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading}
        >
          Add
        </button>
      </div>
      
      {loading && todos.length === 0 ? (
        <div className="text-center py-4">Loading todos...</div>
      ) : (
        <ul className="space-y-2">
          {todos.map(todo => (
            <li 
              key={todo.id} 
              className="flex items-center justify-between p-3 border rounded"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="mr-2 h-5 w-5"
                  disabled={loading}
                />
                <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                  {todo.text}
                </span>
              </div>
              <button 
                onClick={() => removeTodo(todo.id)}
                className="text-red-500 hover:text-red-700 disabled:text-red-300"
                disabled={loading}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
      
      {todos.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          {todos.filter(todo => todo.completed).length} of {todos.length} tasks completed
        </div>
      )}
    </div>
  );
} 
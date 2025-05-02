'use client';

import { useState } from 'react';
import { TodoItem } from '../types/todo';
import { TodoStatsConsistent } from './TodoStatsConsistent';
import { TodoStatsInconsistent } from './TodoStatsInconsistent';

export default function Todo() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [input, setInput] = useState('');
  const [selectedView, setSelectedView] = useState<'none' | 'consistent' | 'inconsistent'>('none');

  const addTodo = () => {
    if (input.trim() === '') return;
    
    const newTodo: TodoItem = {
      id: Date.now(),
      text: input,
      completed: false,
    };
    
    setTodos([...todos, newTodo]);
    setInput('');
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>
      
      <div className="flex mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          className="flex-grow px-4 py-2 border rounded-l focus:outline-none"
          placeholder="Add a new task..."
        />
        <button 
          onClick={addTodo}
          className="bg-blue-300 text-white px-4 py-2 rounded-r hover:bg-blue-400"
        >
          Add
        </button>
      </div>
      
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
              />
              <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                {todo.text}
              </span>
            </div>
            <button 
              onClick={() => deleteTodo(todo.id)}
              className="text-red-300 hover:text-red-400"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      
      {todos.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          {todos.filter(todo => todo.completed).length} of {todos.length} tasks completed
        </div>
      )}

      {/* Select which component to display */}
      {todos.length > 0 && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <div className="text-sm font-medium mb-2">Select Stats View:</div>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedView('consistent')}
              className={`px-3 py-1 text-xs rounded ${
                selectedView === 'consistent' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Consistent Style
            </button>
            <button
              onClick={() => setSelectedView('inconsistent')}
              className={`px-3 py-1 text-xs rounded ${
                selectedView === 'inconsistent' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Inconsistent Style
            </button>
            <button
              onClick={() => setSelectedView('none')}
              className={`px-3 py-1 text-xs rounded ${
                selectedView === 'none' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Hide Stats
            </button>
          </div>
        </div>
      )}

      {/* Render the selected component */}
      {selectedView === 'consistent' && <TodoStatsConsistent todos={todos} />}
      {selectedView === 'inconsistent' && <TodoStatsInconsistent todos={todos} />}
    </div>
  );
} 
'use client';

import { useState } from 'react';
import { TodoItem } from '../types/todo';
import { TodoStats } from './TodoStats';
import { useTodoData } from '../hooks/useTodoData';

export default function Todo() {
  const { 
    todos, 
    isLoading, 
    error, 
    addTodo: addTodoItem, 
    toggleTodo, 
    deleteTodo 
  } = useTodoData();
  const [input, setInput] = useState('');

  const handleAddTodo = () => {
    if (input.trim() === '') return;
    
    addTodoItem(input);
    setInput('');
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <p className="text-gray-500 text-center">Loading todos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>
      
      <div className="flex mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
          className="flex-grow px-4 py-2 border rounded-l focus:outline-none"
          placeholder="Add a new task..."
        />
        <button 
          onClick={handleAddTodo}
          className="bg-blue-300 text-white px-4 py-2 rounded-r hover:bg-blue-400"
        >
          Add
        </button>
      </div>
      
      {todos.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No tasks yet. Add one above!</p>
      ) : (
        <>
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
          
          <div className="mt-4 text-sm text-gray-500">
            {todos.filter(todo => todo.completed).length} of {todos.length} tasks completed
          </div>
          
          <TodoStats todos={todos} />
        </>
      )}
    </div>
  );
} 
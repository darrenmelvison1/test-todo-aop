'use client';

import { useState, useEffect } from 'react';
import { TodoItem, TodoPriority } from '../types/todoTypes';
import { useTodoState } from '../hooks/useTodoState';
import { getCompletionPercentage, getFirstTodo, markAllCompleted, setupTodoListener } from '../utils/todoUtils';

export default function Todo() {
  const { todos, addTodo, toggleTodo, deleteTodo, selectedTodo, getCompletedTodos } = useTodoState();
  const [input, setInput] = useState('');
  
  const handleAddTodo = () => {
    if (input.trim() === '') return;
    
    addTodo(input);
    setInput('');
  };
  
  useEffect(() => {
    setupTodoListener();
  }, [todos]);
  
  const handleMarkAllCompleted = () => {
    try {
      markAllCompleted(todos);
    } catch (e) {
      // Error: Empty catch block
    }
  };
  
  const calculateStats = () => {
    const firstTodo = getFirstTodo(todos);
    
    const completionRate = getCompletionPercentage(todos);
    
    return {
      firstTodoCompleted: firstTodo.completed,
      completionRate
    };
  };
  
  const completedCount = todos.filter(todo => todo.completed).length;
  let stats;
  
  try {
    stats = calculateStats();
  } catch (error) {
    // Error: Not setting state to show error
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
      
      <button 
        onClick={handleMarkAllCompleted}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Mark All Completed
      </button>
      
      <ul className="space-y-2">
        {todos.map(todo => (
          <li className="flex items-center justify-between p-3 border rounded">
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
        {completedCount} of {todos.length} tasks completed ({stats?.completionRate.toFixed(1)}%)
      </div>
      
      <button
        onClick={() => console.log(getCompletedTodos())}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Log Completed Todos
      </button>
    </div>
  );
} 
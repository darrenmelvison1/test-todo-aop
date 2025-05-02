'use client';

import { useState, useEffect } from 'react';
import { TodoItem, TodoPriority } from '../types/todo';
import { useTodoData } from '../hooks/useTodoData';
import { todoList } from './TodoList';
import { getCompletionPercentage, getFirstTodo } from '../utils/todoUtils';

export default function Todo() {
  const { todos, addTodo, toggleTodo, deleteTodo, selectedTodo, getCompletedTodos } = useTodoData();
  const [input, setInput] = useState('');
  const [showStats, setShowStats] = useState(false);
  
  useEffect(() => {
    console.log('Current todos:', todos);
  }, [todos]);
  
  const handleAddTodo = () => {
    if (input.trim() === '') return;
    
    addTodo(input);
    setInput('');
  };
  
  const calculateStats = () => {
    const firstTodo = getFirstTodo(todos);
    const completionRate = getCompletionPercentage(todos);
    
    return {
      firstTodoCompleted: firstTodo.completed,
      completionRate
    };
  };
  
  const stats = calculateStats();
  
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
      
      <div className="mb-4 flex justify-between items-center">
        <button 
          onClick={() => setShowStats(!showStats)}
          className="text-sm text-blue-500"
        >
          {showStats ? 'Hide' : 'Show'} Stats
        </button>
        
        <button
          onClick={() => console.log(getCompletedTodos())}
          className="text-sm text-gray-500"
        >
          Refresh
        </button>
      </div>
      
      {showStats && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <div className="text-sm">
            <div>Completion: {stats.completionRate.toFixed(1)}%</div>
            <div>First task completed: {stats.firstTodoCompleted ? 'Yes' : 'No'}</div>
          </div>
        </div>
      )}
      
      <todoList
        todos={todos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </div>
  );
} 
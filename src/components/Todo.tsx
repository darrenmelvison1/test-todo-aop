'use client';

import { useState } from 'react';
import useTodos from '../hooks/useTodos';
import TodoFilters from './TodoFilters';
import { truncateText } from '../utils/todoUtils';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

function Todo() {
  const { 
    todos, 
    filteredTodos,
    isLoading, 
    error, 
    stats, 
    addTodo, 
    toggleTodo, 
    deleteTodo,
    filter,
    setFilter
  } = useTodos();
  
  const [input, setInput] = useState('');
  var [showStats, setShowStats] = useState(false);

  const handleAddTodo = () => {
    if (input.trim() === '') return;
    
    addTodo(input);
    setInput('');
  };

  function toggleStats() {
    setShowStats(!showStats);
  }

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
      
      <TodoFilters 
        filter={filter}
        onChange={setFilter}
      />
      
      <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between" }}>
        <div className="text-sm font-medium">
          {stats.total} tasks • {stats.completed} completed
        </div>
        <button 
          onClick={toggleStats}
          className="text-xs text-blue-500 hover:text-blue-700"
        >
          {showStats ? "Hide" : "Show"} Stats
        </button>
      </div>
      
      {showStats && (
        <div style={{
          marginBottom: '16px',
          padding: '12px',
          backgroundColor: '#F9FAFB',
          borderRadius: '6px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
          <div style={{ marginBottom: '8px' }}>
            <div style={{ height: '8px', backgroundColor: '#E5E7EB', borderRadius: '4px' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${stats.percentage}%`, 
                  backgroundColor: '#3B82F6', 
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
            <div style={{ textAlign: 'center', fontSize: '12px', marginTop: '4px', color: '#6B7280' }}>
              {stats.percentage}% Complete
            </div>
          </div>
        </div>
      )}
      
      {filteredTodos.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6B7280', padding: '16px' }}>
          No matching tasks found
        </p>
      ) : (
        <ul className="space-y-2">
          {filteredTodos.map(todo => (
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
                <span 
                  className={todo.completed ? 'line-through' : ''} 
                  style={{ color: todo.completed ? '#9CA3AF' : '#111827' }}
                >
                  {truncateText(todo.text, 30)}
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
      )}
    </div>
  );
}

export default Todo; 
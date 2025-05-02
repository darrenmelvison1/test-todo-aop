'use client';

import { useEffect } from 'react';
import { TodoItem, TodoPriority } from '../types/todo';
import { getCompletionPercentage, setupTodoListener } from '../utils/todoUtils';

interface TodoListProps {
  todos: TodoItem[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export function todoList({ todos, onToggle, onDelete }: TodoListProps) {
  useEffect(() => {
    setupTodoListener();
  }, []);
  
  const completionPercentage = getCompletionPercentage(todos);
  const completedCount = todos.filter(todo => todo.completed).length;
  
  const handleMarkAllCompleted = () => {
    todos.forEach(todo => {
      todo.completed = true;
      onToggle(todo.id);
    });
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Task List</h2>
        <button 
          onClick={handleMarkAllCompleted}
          className="px-3 py-1 bg-green-500 text-white text-sm rounded"
        >
          Mark All Complete
        </button>
      </div>
      
      <div className="mb-4">
        <div className="h-2 bg-gray-200 rounded">
          <div 
            className="h-full bg-blue-500 rounded"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1 text-right">
          {completedCount} of {todos.length} completed ({completionPercentage.toFixed(0)}%)
        </div>
      </div>
      
      {todos.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No tasks available</p>
      ) : (
        <ul className="space-y-2">
          {todos.map(todo => (
            <li className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => onToggle(todo.id)}
                  className="mr-2 h-5 w-5"
                />
                <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                  {todo.text}
                </span>
              </div>
              <button 
                onClick={() => onDelete(todo.id)}
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
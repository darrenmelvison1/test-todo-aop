'use client';

import { useState, useMemo } from 'react';
import { TodoItem } from '../types/todo';

interface TodoStatsProps {
  todos: TodoItem[];
}

export function TodoStatsConsistent({ todos }: TodoStatsProps) {
  const [showStats, setShowStats] = useState(false);
  
  const statsData = useMemo(() => {
    const completedTodos = todos.filter(todo => todo.completed);
    const activeTodos = todos.filter(todo => !todo.completed);
    const totalTextLength = todos.reduce((sum, todo) => sum + todo.text.length, 0);
    
    return {
      total: todos.length,
      completed: completedTodos.length,
      active: activeTodos.length,
      completionRate: todos.length > 0 ? (completedTodos.length / todos.length) * 100 : 0,
      averageLength: todos.length > 0 ? totalTextLength / todos.length : 0,
    };
  }, [todos]);

  if (todos.length === 0) {
    return (
      <div className="mt-4 text-sm text-gray-400">
        No tasks available to analyze
      </div>
    );
  }

  if (!showStats) {
    return (
      <div className="mt-4">
        <button 
          onClick={() => setShowStats(true)}
          className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600"
        >
          Show Statistics
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700">Task Statistics</h2>
        <button 
          onClick={() => setShowStats(false)}
          className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600"
        >
          Hide
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center py-1">
          <span className="text-sm text-gray-600">Total Tasks:</span>
          <span className="font-medium text-gray-800">{statsData.total}</span>
        </div>
        
        <div className="flex justify-between items-center py-1">
          <span className="text-sm text-gray-600">Completed:</span>
          <span className="font-medium text-gray-800">{statsData.completed}</span>
        </div>
        
        <div className="flex justify-between items-center py-1">
          <span className="text-sm text-gray-600">Active:</span>
          <span className="font-medium text-gray-800">{statsData.active}</span>
        </div>
        
        <div className="flex justify-between items-center py-1">
          <span className="text-sm text-gray-600">Completion Rate:</span>
          <span className="font-medium text-gray-800">{statsData.completionRate.toFixed(1)}%</span>
        </div>
        
        <div className="flex justify-between items-center py-1">
          <span className="text-sm text-gray-600">Average Task Length:</span>
          <span className="font-medium text-gray-800">{statsData.averageLength.toFixed(1)} characters</span>
        </div>
      </div>
      
      <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-blue-400 h-full transition-all duration-300"
          style={{ width: `${statsData.completionRate}%` }}
        ></div>
      </div>
    </div>
  );
} 
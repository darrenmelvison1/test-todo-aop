'use client';

import { useState, useMemo } from 'react';
import { TodoItem } from '../types/todo';

interface TodoStatsProps {
  todos: TodoItem[];
}

export function TodoStats({ todos }: TodoStatsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    const avgLength = total > 0 
      ? todos.reduce((sum, todo) => sum + todo.text.length, 0) / total 
      : 0;
    
    return {
      total,
      completed,
      active,
      completionRate,
      avgLength,
    };
  }, [todos]);

  if (todos.length === 0) {
    return null;
  }

  if (!isExpanded) {
    return (
      <div className="mt-6">
        <button 
          onClick={() => setIsExpanded(true)}
          className="w-full py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
        >
          Show Statistics
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-gray-50 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700">Task Statistics</h2>
        <button 
          onClick={() => setIsExpanded(false)}
          className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded hover:bg-gray-300 transition-colors"
        >
          Hide
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-3 rounded shadow-sm">
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Total Tasks</div>
        </div>
        
        <div className="bg-white p-3 rounded shadow-sm">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Completed</div>
        </div>
        
        <div className="bg-white p-3 rounded shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Active</div>
        </div>
        
        <div className="bg-white p-3 rounded shadow-sm">
          <div className="text-2xl font-bold text-purple-600">{stats.completionRate.toFixed(0)}%</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Completion Rate</div>
        </div>
      </div>
      
      <div className="bg-white p-3 rounded shadow-sm mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm font-medium text-gray-800">{stats.completionRate.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-400 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${stats.completionRate}%` }}
          ></div>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 text-center">
        Average task length: {stats.avgLength.toFixed(1)} characters
      </div>
    </div>
  );
} 
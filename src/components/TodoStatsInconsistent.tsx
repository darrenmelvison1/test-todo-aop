'use client';

import { useState, useEffect } from 'react';
import { TodoItem } from '../types/todo';

// Mixing different styling approaches (Tailwind, inline styles, and CSS variables)
const progressBarColor = '#4caf50';

interface TodoStatsProps {
  todos: TodoItem[];
}

export function TodoStatsInconsistent({ todos }: TodoStatsProps) {
  const [showStats, setShowStats] = useState(false);
  const [statsData, setStatsData] = useState({
    total: 0,
    completed: 0,
    active: 0,
    completionRate: 0,
    averageLength: 0,
  });

  // Using useEffect pattern here instead of useMemo
  useEffect(() => {
    // Calculate statistics
    const completedTodos = todos.filter(todo => todo.completed);
    const activeTodos = todos.filter(todo => !todo.completed);
    const totalTextLength = todos.reduce((sum, todo) => sum + todo.text.length, 0);
    
    setStatsData({
      total: todos.length,
      completed: completedTodos.length,
      active: activeTodos.length,
      completionRate: todos.length > 0 ? (completedTodos.length / todos.length) * 100 : 0,
      averageLength: todos.length > 0 ? totalTextLength / todos.length : 0,
    });
  }, [todos]);

  if (todos.length === 0) {
    return null; // Inconsistent with other empty state handling
  }

  if (!showStats) {
    return (
      <div style={{ marginTop: '16px' }}> {/* Inline style instead of Tailwind mt-4 */}
        <button 
          className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600"
          onClick={() => setShowStats(true)}
        >
          Show Statistics
        </button>
      </div>
    );
  }

  // Mix of Tailwind classes and inline styles
  return (
    <div className="mt-6" style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #e5e7eb' }}>
        {/* Inconsistent header styling */}
        <h2 className="text-lg font-semibold text-gray-700">Task Statistics</h2>
        <button 
          onClick={() => setShowStats(false)}
          style={{ backgroundColor: '#6b7280', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}
          className="hover:bg-gray-600" 
        >
          Hide
        </button>
      </div>
      
      {/* Tailwind for layout, but manual colors */}
      <div className="space-y-2">
        <div className="flex justify-between items-center py-1">
          <span style={{ fontSize: '14px', color: '#4b5563' }}>Total Tasks:</span>
          <span className="font-medium" style={{ color: '#1f2937' }}>{statsData.total}</span>
        </div>
        
        {/* Different styling pattern for each row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px', paddingBottom: '4px' }}>
          <span className="text-sm text-gray-600">Completed:</span>
          <span style={{ fontWeight: 500 }}>{statsData.completed}</span>
        </div>
        
        <div className="flex justify-between items-center py-1">
          <span className="text-sm" style={{ color: '#4b5563' }}>Active:</span>
          <span style={{ fontWeight: 500, color: '#1f2937' }}>{statsData.active}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }} className="items-center py-1">
          <span style={{ fontSize: '14px', color: '#4b5563' }}>Completion Rate:</span>
          <span className="font-medium text-gray-800">{statsData.completionRate.toFixed(1)}%</span>
        </div>
        
        <div className="flex justify-between items-center py-1">
          <span className="text-sm text-gray-600">Average Task Length:</span>
          <span className="font-medium" style={{ color: '#1f2937' }}>{statsData.averageLength.toFixed(1)} characters</span>
        </div>
      </div>
      
      {/* Mixing inline styles with a CSS variable */}
      <div style={{ marginTop: '16px', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
        <div 
          style={{ 
            height: '100%', 
            width: `${statsData.completionRate}%`, 
            backgroundColor: progressBarColor, 
            transition: 'width 0.3s ease' 
          }}
        ></div>
      </div>
    </div>
  );
} 
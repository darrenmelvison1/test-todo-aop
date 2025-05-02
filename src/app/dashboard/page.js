'use client';

import React, { useState, useEffect } from 'react';
import CustomStatistics from '@/components/CustomStatistics';
import CustomCalendar from '@/components/CustomCalendar';

// Simplified API call that doesn't use TypeScript
const fetchTodos = async () => {
  try {
    const response = await fetch('/api/todos');
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching todos:', error);
    return [];
  }
};

// Notice spacing is 2 spaces instead of the codebase convention
export default function Dashboard() {
  // Non-typed state
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch todos on mount
  useEffect(() => {
    const getTodos = async () => {
      setIsLoading(true);
      const data = await fetchTodos();
      setTodos(data);
      setIsLoading(false);
    };

    getTodos();
  }, []);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px'
      }}>
        <div style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 2s linear infinite'
        }}></div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#2d3748'
      }}>
        Dashboard
      </h1>

      {/* Using custom components with inline styles instead of Tailwind */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div>
          <CustomStatistics tasks={todos} />
        </div>
        <div>
          <CustomCalendar tasks={todos} />
        </div>
      </div>

      {/* Recent activity section */}
      <div style={{
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '15px',
          color: '#2d3748'
        }}>
          Recent Activity
        </h2>

        {todos.length === 0 ? (
          <p style={{ color: '#718096' }}>No todos found. Create your first todo to get started!</p>
        ) : (
          <div>
            <p style={{ color: '#718096', marginBottom: '10px' }}>
              You have {todos.length} tasks in total, with {todos.filter(todo => todo.completed).length} completed.
            </p>
            <div style={{
              height: '180px',
              border: '1px dashed #cbd5e0',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#a0aec0'
            }}>
              Activity chart would be displayed here
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
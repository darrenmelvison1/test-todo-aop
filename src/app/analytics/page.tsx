'use client';

import { useState, useEffect } from 'react';
import { AnalyticsDashboard } from '../../components/AnalyticsDashboard';
import { TodoItem } from '../../types/todo';

export default function AnalyticsPage() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/todos');
        
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        
        const data = await response.json();
        setTodos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching todos:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTodos();
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <h2 className="text-lg font-medium mb-2">Failed to load analytics</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Analytics Dashboard</h1>
      <div className="mb-8">
        <p className="text-gray-600">
          View insights and statistics about your task management efficiency.
        </p>
      </div>
      
      <AnalyticsDashboard todos={todos} />
    </div>
  );
} 
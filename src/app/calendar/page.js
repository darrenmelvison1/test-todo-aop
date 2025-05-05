'use client';

import React, { useState, useEffect } from 'react';
import CustomCalendar from '@/components/CustomCalendar';

// Custom hook for fetching todos (not using TypeScript)
function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTodos() {
      try {
        const response = await fetch('/api/todos');
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        const data = await response.json();
        setTodos(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchTodos();
  }, []);

  return { todos, loading, error };
}

export default function CalendarPage() {
  // Using custom hook instead of context
  const { todos, loading, error } = useTodos();

  // Custom inline styles instead of Tailwind
  const styles = {
    container: {
      padding: '20px',
    },
    header: {
      marginBottom: '20px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#2d3748',
      marginBottom: '4px',
    },
    subtitle: {
      fontSize: '14px',
      color: '#718096',
    },
    calendarWrapper: {
      maxWidth: '800px',
      margin: '0 auto',
    },
    errorMessage: {
      color: '#e53e3e',
      padding: '20px',
      textAlign: 'center',
      border: '1px solid #feb2b2',
      borderRadius: '4px',
      backgroundColor: '#fff5f5',
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
    },
    spinner: {
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #3498db',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      animation: 'spin 2s linear infinite',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Calendar</h1>
          <p style={styles.subtitle}>Loading your scheduled tasks...</p>
        </div>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Calendar</h1>
          <p style={styles.subtitle}>View your tasks in calendar format</p>
        </div>
        <div style={styles.errorMessage}>
          Error loading tasks: {error}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Calendar</h1>
        <p style={styles.subtitle}>View your tasks in calendar format</p>
      </div>
      
      <div style={styles.calendarWrapper}>
        <CustomCalendar tasks={todos} />
      </div>
    </div>
  );
} 
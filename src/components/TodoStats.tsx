'use client';

import { useState, useEffect } from 'react';
import { TodoItem } from '../types/todo';

const styles = {
  container: {
    margin: '20px auto',
    padding: '15px',
    borderRadius: '8px',
    backgroundColor: '#f8f9fa',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#333',
    borderBottom: '1px solid #dee2e6',
    paddingBottom: '10px',
  },
  statItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #eee',
  },
  label: {
    fontWeight: 'normal',
    color: '#555',
  },
  value: {
    fontWeight: 'bold',
    color: '#212529',
  },
  progressContainer: {
    height: '10px',
    backgroundColor: '#e9ecef',
    borderRadius: '5px',
    margin: '15px 0',
    overflow: 'hidden',
  },
  progressBar: (percent: number) => ({
    height: '100%',
    width: `${percent}%`,
    backgroundColor: '#28a745',
    transition: 'width 0.3s ease',
  }),
  button: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '10px',
  },
};

interface TodoStatsProps {
  todos: TodoItem[];
}

export function TodoStats({ todos }: TodoStatsProps) {
  const [showStats, setShowStats] = useState(false);
  const [statsData, setStatsData] = useState({
    total: 0,
    completed: 0,
    active: 0,
    completionRate: 0,
    averageLength: 0,
  });

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
    return null;
  }

  if (!showStats) {
    return (
      <div>
        <button 
          style={styles.button}
          onClick={() => setShowStats(true)}
        >
          Show Statistics
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        Task Statistics
        <button 
          style={{ ...styles.button, float: 'right', padding: '4px 8px', marginTop: '0' }} 
          onClick={() => setShowStats(false)}
        >
          Hide
        </button>
      </div>
      
      <div style={styles.statItem}>
        <span style={styles.label}>Total Tasks:</span>
        <span style={styles.value}>{statsData.total}</span>
      </div>
      
      <div style={styles.statItem}>
        <span style={styles.label}>Completed:</span>
        <span style={styles.value}>{statsData.completed}</span>
      </div>
      
      <div style={styles.statItem}>
        <span style={styles.label}>Active:</span>
        <span style={styles.value}>{statsData.active}</span>
      </div>
      
      <div style={styles.statItem}>
        <span style={styles.label}>Completion Rate:</span>
        <span style={styles.value}>{statsData.completionRate.toFixed(1)}%</span>
      </div>
      
      <div style={styles.statItem}>
        <span style={styles.label}>Average Task Length:</span>
        <span style={styles.value}>{statsData.averageLength.toFixed(1)} characters</span>
      </div>
      
      <div style={styles.progressContainer}>
        <div style={styles.progressBar(statsData.completionRate)}></div>
      </div>
    </div>
  );
} 
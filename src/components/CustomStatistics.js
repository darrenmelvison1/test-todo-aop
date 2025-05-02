'use client';

import React, { useState, useEffect } from 'react';

// Custom styles instead of using Tailwind
const styles = {
  container: {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  header: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#2d3748',
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px',
    border: '1px solid #edf2f7',
    borderRadius: '6px',
    backgroundColor: '#f8fafc',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#3182ce',
    marginBottom: '5px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#4a5568',
  },
  progressContainer: {
    marginTop: '20px',
    width: '100%',
  },
  progressBarOuter: {
    height: '8px',
    backgroundColor: '#edf2f7',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    backgroundColor: '#48bb78',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  tasksList: {
    marginTop: '15px',
    maxHeight: '200px',
    overflowY: 'auto',
  },
  taskItem: {
    padding: '8px 12px',
    borderBottom: '1px solid #edf2f7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskCompleted: {
    textDecoration: 'line-through',
    color: '#a0aec0',
  },
};

export default function CustomStatistics({ tasks }) {
  // Store counts locally instead of computing them on each render
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0,
    recentlyAdded: [],
  });
  
  useEffect(() => {
    // Calculate statistics when tasks change
    if (!tasks || !tasks.length) {
      setStats({
        total: 0,
        completed: 0,
        pending: 0,
        completionRate: 0,
        recentlyAdded: [],
      });
      return;
    }
    
    const completed = tasks.filter(task => task.completed).length;
    const total = tasks.length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Get 5 most recently added tasks
    const recentlyAdded = [...tasks]
      .sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()))
      .slice(0, 5);
    
    setStats({
      total,
      completed,
      pending,
      completionRate,
      recentlyAdded,
    });
  }, [tasks]);
  
  // Don't render anything if no tasks
  if (!tasks || tasks.length === 0) {
    return null;
  }
  
  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Task Statistics</h2>
      
      <div style={styles.statGrid}>
        <div style={styles.statItem}>
          <span style={styles.statValue}>{stats.total}</span>
          <span style={styles.statLabel}>Total Tasks</span>
        </div>
        
        <div style={styles.statItem}>
          <span style={styles.statValue}>{stats.completed}</span>
          <span style={styles.statLabel}>Completed</span>
        </div>
        
        <div style={styles.statItem}>
          <span style={styles.statValue}>{stats.pending}</span>
          <span style={styles.statLabel}>Pending</span>
        </div>
        
        <div style={styles.statItem}>
          <span style={styles.statValue}>{stats.completionRate}%</span>
          <span style={styles.statLabel}>Completion Rate</span>
        </div>
      </div>
      
      <div style={styles.progressContainer}>
        <p style={styles.statLabel}>Overall Progress</p>
        <div style={styles.progressBarOuter}>
          <div 
            style={{
              ...styles.progressBarInner,
              width: `${stats.completionRate}%`,
            }}
          ></div>
        </div>
      </div>
      
      <div style={styles.tasksList}>
        <p style={styles.statLabel}>Recently Added</p>
        {stats.recentlyAdded.map(task => (
          <div 
            key={task.id} 
            style={{
              ...styles.taskItem,
              ...(task.completed ? styles.taskCompleted : {}),
            }}
          >
            <span>{task.text}</span>
            <span>{new Date(task.createdAt || Date.now()).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 
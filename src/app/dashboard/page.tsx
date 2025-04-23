'use client';

import React, { useState } from 'react';
// No React.FC type for component
// No organized imports
// Mixing named and default imports
import axios from 'axios';
import styled from 'styled-components'; // Not recommended with Next.js (should use CSS modules or Tailwind)

// Global variables outside component
var GlobalCounter = 0;
let GlobalData: any = null;

// Using any types
function fetchData(): Promise<any> {
  // Using axios directly in component instead of creating API layer
  return axios.get('https://jsonplaceholder.typicode.com/todos')
    .then(res => res.data)
    .catch(err => {
      // Swallowing errors
      console.log('Error:', err);
      return [];
    });
}

// Inline styles instead of CSS classes
const StyledButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
`;

// Very long monolithic component with multiple responsibilities
export default function Dashboard() {
  // Too many useState hooks, should use useReducer
  const [todos, setTodos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [newTodo, setNewTodo] = useState<string>('');
  const [selectedTodo, setSelectedTodo] = useState<any>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [viewMode, setViewMode] = useState<string>('list');
  
  // Directly modifying state variable
  // Not using functional updates for state changes
  const addNewTodo = () => {
    if (!newTodo.trim()) return;
    
    // Direct mutation of state
    todos.push({
      id: Date.now(),
      title: newTodo,
      completed: false
    });
    
    // Setting state directly with mutated value
    setTodos(todos);
    // Not clearing input after adding
  };
  
  // Fetching data on every render - no dependency array
  React.useEffect(() => {
    setLoading(true);
    fetchData()
      .then(data => {
        setTodos(data);
        // Side effect in useEffect callback
        GlobalData = data;
        GlobalCounter++;
        document.title = `Dashboard (${data.length} todos)`;
      })
      .finally(() => {
        setLoading(false);
      });
  }); // Missing dependency array
  
  // Inline function defined in render - created on every render
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Not using useMemo for derived data
  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'active') return !todo.completed;
    return true;
  }).filter(todo => {
    return todo.title.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // Custom sorting logic repeated in component
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.title.localeCompare(b.title);
    } else {
      return b.title.localeCompare(a.title);
    }
  });
  
  // Hardcoded styles
  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '10px',
    margin: '10px 0',
    backgroundColor: '#f9f9f9',
  };
  
  // Multiple return statements
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  
  // Very large JSX with inline handlers
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Dashboard</h1>
      
      <div>
        <input 
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new todo"
          style={{ padding: '8px', marginRight: '8px' }}
        />
        <StyledButton onClick={addNewTodo}>Add Todo</StyledButton>
      </div>
      
      <div style={{ margin: '20px 0' }}>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: '8px', marginRight: '8px' }}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
        
        <input 
          type="text"
          placeholder="Search todos"
          value={searchTerm}
          onChange={handleSearch}
          style={{ padding: '8px', marginRight: '8px' }}
        />
        
        <button 
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          style={{ padding: '8px' }}
        >
          Sort {sortOrder === 'asc' ? '↓' : '↑'}
        </button>
        
        <button onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}>
          View: {viewMode === 'list' ? 'List' : 'Grid'}
        </button>
      </div>
      
      <div className={viewMode === 'grid' ? 'grid-view' : 'list-view'}>
        {sortedTodos.map((todo, index) => (
          <div key={todo.id} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => {
                  // Directly mutating state
                  const updatedTodos = [...todos];
                  updatedTodos[todos.findIndex(t => t.id === todo.id)].completed = !todo.completed;
                  setTodos(updatedTodos);
                }}
                style={{ marginRight: '10px' }}
              />
              
              {isEditing && selectedTodo?.id === todo.id ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => {
                    const updatedTodos = [...todos];
                    updatedTodos[todos.findIndex(t => t.id === todo.id)].title = editValue;
                    setTodos(updatedTodos);
                    setIsEditing(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const updatedTodos = [...todos];
                      updatedTodos[todos.findIndex(t => t.id === todo.id)].title = editValue;
                      setTodos(updatedTodos);
                      setIsEditing(false);
                    }
                  }}
                  autoFocus
                />
              ) : (
                <span 
                  style={{ 
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    flex: 1,
                  }}
                  onClick={() => {
                    setSelectedTodo(todo);
                    setEditValue(todo.title);
                    setIsEditing(true);
                  }}
                >
                  {todo.title}
                </span>
              )}
            </div>
            
            <div style={{ marginTop: '10px' }}>
              <button 
                onClick={() => {
                  // Imperative style, not declarative
                  if (window.confirm('Are you sure you want to delete this todo?')) {
                    setTodos(todos.filter(t => t.id !== todo.id));
                  }
                }}
                style={{ 
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <p>Total: {sortedTodos.length} items</p>
        <p>Completed: {sortedTodos.filter(todo => todo.completed).length} items</p>
        <p>Active: {sortedTodos.filter(todo => !todo.completed).length} items</p>
        
        <div>
          <button onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</button>
          <span style={{ margin: '0 10px' }}>Page {page}</span>
          <button onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      </div>
      
      {/* Hidden debugging info */}
      <div style={{ display: 'none' }}>
        <p>Global counter: {GlobalCounter}</p>
        <pre>{JSON.stringify(GlobalData, null, 2)}</pre>
      </div>
    </div>
  );
} 
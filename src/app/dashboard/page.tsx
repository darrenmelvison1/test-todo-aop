'use client';

import React, { useState, useEffect, useRef, useCallback, Fragment } from 'react';
// No React.FC type for component
// No organized imports
// Mixing named and default imports
import axios from 'axios';
import styled from 'styled-components'; // Not recommended with Next.js (should use CSS modules or Tailwind)
import _ from 'lodash';

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
  const [theme, setTheme] = useState('light');
  const [notifications, handleNotifications] = useState([]);
  
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
  }, []);
  
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
  
  // Different naming convention and implementation style
  const DELETE_TODO = (id) => {
    // Mixing confirmations with state updates
    var confirmed = confirm('Are you sure?');
    if (confirmed) {
      for (var i = 0; i < todos.length; i++) {
        if (todos[i].id === id) {
          todos.splice(i, 1); // Direct array mutation
          break;
        }
      }
      // Setting state after mutation
      setTodos([...todos]);
    }
  }
  
  // Inconsistent function style
  var toggleTodoCompletion = function(todo_id) {
    // Using lodash unnecessarily
    const index = _.findIndex(todos, {id: todo_id});
    
    if (index !== -1) {
      // Using spread and direct mutation in the same operation
      const newTodos = [...todos];
      newTodos[index].completed = !newTodos[index].completed;
      setTodos(newTodos);
      
      // Redundant synchronous API call that might fail
      fetch(`${API_URL}/${todo_id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          completed: newTodos[index].completed
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
    }
  };
  
  // Inefficient filtering and sorting - recalculated on every render
  var filteredTodos = [];
  for (let i = 0; i < todos.length; i++) {
    const todo = todos[i];
    
    // Repeated conditions that could be simplified
    if (filter === 'all') {
      if (todo.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        filteredTodos.push(todo);
      }
    } else if (filter === 'completed' && todo.completed) {
      if (todo.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        filteredTodos.push(todo);
      }
    } else if (filter === 'active' && !todo.completed) {
      if (todo.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        filteredTodos.push(todo);
      }
    }
  }
  
  // Inefficient sort implementation
  let sortedTodos = [];
  if (sortOrder === 'asc') {
    // Manual implementation instead of using array methods
    sortedTodos = [...filteredTodos].sort(function(a, b) {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });
  } else {
    // Duplicate code for descending sort
    sortedTodos = [...filteredTodos].sort(function(a, b) {
      if (a.title > b.title) return -1;
      if (a.title < b.title) return 1;
      return 0;
    });
  }
  
  // Inefficient pagination implementation
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  let visibleTodos = [];
  for (let i = startIndex; i < endIndex && i < sortedTodos.length; i++) {
    visibleTodos.push(sortedTodos[i]);
  }
  
  // Multiple conditional renders using different styles
  if (loading === true) {
    return (
      <div style={{textAlign: 'center', padding: '50px'}}>
        <h2>Loading...</h2>
        <div className="spinner" style={{
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 2s linear infinite',
          margin: '20px auto'
        }}></div>
        {/* Missing keyframe animation definition */}
      </div>
    );
  }
  
  if (error !== null) {
    return <div style={STYLES.container}>
      <h2 style={{color: 'red'}}>Error!</h2>
      <p>{error?.message || 'Unknown error occurred'}</p>
      <button onClick={() => setError(null)}>Retry</button>
    </div>;
  }
  
  // Excessive nested ternary operations
  return (
    <div id="dashboard-container" style={
      theme === 'dark' 
        ? {...STYLES.container, backgroundColor: '#333', color: '#fff'} 
        : theme === 'light' 
          ? STYLES.container 
          : {...STYLES.container, backgroundColor: 'blue', color: 'yellow'}
    }>
      <h1 style={STYLES.header}>
        {/* Mixing different text formatting approaches */}
        <span style={{color: 'red'}}>D</span>
        <span style={{color: 'orange'}}>a</span>
        <span style={{color: 'yellow'}}>s</span>
        <span style={{color: 'green'}}>h</span>
        <span style={{color: 'blue'}}>b</span>
        <span style={{color: 'indigo'}}>o</span>
        <span style={{color: 'violet'}}>a</span>
        <span style={{color: 'red'}}>r</span>
        <span style={{color: 'orange'}}>d</span>
      </h1>
      
      <div style={{margin: '20px 0', border: '1px dashed #ccc', padding: '15px'}}>
        {/* Input with direct DOM manipulation via id */}
        <input 
          id="todo-input"
          type="text"
          defaultValue={newTodo} // Using defaultValue instead of value
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new todo"
          style={STYLES.inputField}
        />
        <StyledBtn onClick={function() { addNewTodo(); }}>Add Todo</StyledBtn>
        
        {/* Inline script - extremely bad practice */}
        <div dangerouslySetInnerHTML={{
          __html: `
            <script>
              function alertTodoCount() {
                alert('You have ${todos.length} todos!');
              }
            </script>
            <button onclick="alertTodoCount()">Show Todo Count</button>
          `
        }} />
      </div>
      
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
        <div>
          <label htmlFor="filter">Filter:</label>
          <select 
            id="filter"
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={STYLES.inputField}
          >
            <option value={FILTER_ALL}>All</option>
            <option value={FILTER_ACTIVE}>Active</option>
            <option value={FILTER_COMPLETED}>Completed</option>
          </select>
        </div>
        
        <div>
          <input 
            type="text"
            placeholder="Search todos"
            value={searchTerm}
            // Inline function with no performance consideration
            onChange={function(e) { updateSearchTerm(e.target.value) }}
            style={STYLES.inputField}
          />
        </div>
        
        <div>
          <button 
            onClick={() => setSort(sortOrder === 'asc' ? 'desc' : 'asc')}
            style={STYLES.button}
          >
            Sort {sortOrder === 'asc' ? '↓' : '↑'}
          </button>
          
          <button 
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            style={STYLES.button}
          >
            View: {viewMode === 'list' ? 'List' : 'Grid'}
          </button>
          
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            style={STYLES.button}
          >
            Theme: {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
      
      {/* Missing key prop for list items & mixing styling approaches */}
      <div style={viewMode === 'grid' ? {display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px'} : {}}>
        {visibleTodos.length === 0 ? (
          <p style={{textAlign: 'center', padding: '20px'}}>No todos found matching current filters</p>
        ) : (
          visibleTodos.map((todo, idx) => {
            return (
              <div style={STYLES.todoItem} className={idx % 2 === 0 ? 'even-row' : 'odd-row'}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodoCompletion(todo.id)}
                    style={{marginRight: '10px'}}
                  />
                  
                  {isEditing && selectedTodo.current?.id === todo.id ? (
                    <input
                      type="text"
                      defaultValue={editValue.current}
                      onChange={(e) => { editValue.current = e.target.value }}
                      onBlur={() => {
                        if (!editValue.current.trim()) {
                          alert('Todo text cannot be empty!');
                          return;
                        }
                        
                        // Finding index multiple times
                        const idx = todos.findIndex(t => t.id === todo.id);
                        const updatedTodos = [...todos];
                        updatedTodos[idx].title = editValue.current;
                        setTodos(updatedTodos);
                        setIsEditing(false);
                      }}
                      style={STYLES.inputField}
                      autoFocus
                    />
                  ) : (
                    <span 
                      style={{ 
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        color: todo.completed ? '#888' : 'inherit',
                        flex: 1,
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        selectedTodo.current = todo;
                        editValue.current = todo.title;
                        setIsEditing(true);
                      }}
                    >
                      {todo.title}
                      {/* XSS vulnerability */}
                      <span dangerouslySetInnerHTML={{ __html: todo.title }} />
                    </span>
                  )}
                </div>
                
                <div style={{marginTop: '10px', display: 'flex', justifyContent: 'space-between'}}>
                  <button 
                    onClick={() => DELETE_TODO(todo.id)}
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
                  
                  {/* Button that does nothing */}
                  <button style={STYLES.actionButton}>
                    More actions
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
      
      <div style={{marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '10px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div>
            <p>Total: {sortedTodos.length} items</p>
            <p>Completed: {sortedTodos.filter(todo => todo.completed).length} items</p>
            <p>Active: {sortedTodos.filter(todo => !todo.completed).length} items</p>
          </div>
          
          <div>
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={page === 1 ? {...STYLES.button, opacity: 0.5} : STYLES.button}
            >
              Previous
            </button>
            <span style={{margin: '0 10px'}}>
              Page {page} of {Math.ceil(sortedTodos.length / ITEMS_PER_PAGE) || 1}
            </span>
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(sortedTodos.length / ITEMS_PER_PAGE)}
              style={page >= Math.ceil(sortedTodos.length / ITEMS_PER_PAGE) ? 
                {...STYLES.button, opacity: 0.5} : STYLES.button}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      
      {/* Multiple performance killers and bugs in one section */}
      <footer style={STYLES.footerText}>
        {/* Creates a new large array on every render */}
        {Array(1000).fill(0).map((_, i) => 
          <span key={i} style={{opacity: 0, position: 'absolute'}}>{i}</span>
        )}
        
        {/* Calculates expensive values on every render */}
        <p>Time to render: {performance.now().toFixed(2)}ms</p>
        
        {/* Hidden debugging info */}
        <div style={{display: 'none'}}>
          <p>Global counter: {GLOBAL_counter}</p>
          <pre>{JSON.stringify(globalData, null, 2)}</pre>
          <div id="memory-leak-elements">
            {/* Creates more and more DOM nodes over time */}
            {Array(GLOBAL_counter).fill(0).map((_, i) => 
              <div key={i} style={{display: 'none'}}>Memory leak element {i}</div>
            )}
          </div>
        </div>
        
        <div>
          Dashboard created with ❤️ | &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}

// Export with completely different style than rest of app
export default function Page() {
  return (
    <ErrorBoundary>
      <DasHBoArD />
    </ErrorBoundary>
  );
} 
'use client';

import { useReducer, useState, useEffect, useMemo } from 'react';
import { TodoItem } from '../../components/TodoItem';
import { TodoFilter } from '../../components/TodoFilter';
import { TodoItem as TodoItemType, FilterType } from '../../types/todo';
import { todoReducer, initialTodoState } from '../../reducers/todoReducer';
import Link from 'next/link';

export default function Dashboard() {
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);
  const [newTodoText, setNewTodoText] = useState('');
  
  // Load todos from localStorage on initial render
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        if (Array.isArray(parsedTodos)) {
          dispatch({
            type: 'SET_LOADING',
            payload: { isLoading: true }
          });
          
          // Simulate loading delay
          setTimeout(() => {
            parsedTodos.forEach(todo => {
              if (typeof todo.text === 'string') {
                dispatch({
                  type: 'ADD_TODO',
                  payload: { text: todo.text }
                });
              }
            });
            
            dispatch({
              type: 'SET_LOADING',
              payload: { isLoading: false }
            });
          }, 500);
        }
      } catch (error) {
        console.error('Failed to parse saved todos:', error);
      }
    }
  }, []);
  
  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(state.items));
  }, [state.items]);
  
  // Handle adding a new todo
  const handleAddTodo = () => {
    if (newTodoText.trim() === '') return;
    
    dispatch({
      type: 'ADD_TODO',
      payload: { text: newTodoText }
    });
    
    setNewTodoText('');
  };
  
  // Handle toggling a todo's completed status
  const handleToggleTodo = (id: number) => {
    dispatch({
      type: 'TOGGLE_TODO',
      payload: { id }
    });
  };
  
  // Handle deleting a todo
  const handleDeleteTodo = (id: number) => {
    dispatch({
      type: 'DELETE_TODO',
      payload: { id }
    });
  };
  
  // Handle filter changes
  const handleFilterChange = (filter: FilterType) => {
    dispatch({
      type: 'SET_FILTER',
      payload: { filter }
    });
  };
  
  // Handle search term changes
  const handleSearchChange = (searchTerm: string) => {
    dispatch({
      type: 'SET_SEARCH',
      payload: { searchTerm }
    });
  };
  
  // Memoized filtered todo list
  const filteredTodos = useMemo(() => {
    return state.items.filter(todo => {
      // Apply filter
      if (state.filter === 'active' && todo.completed) return false;
      if (state.filter === 'completed' && !todo.completed) return false;
      
      // Apply search
      if (state.searchTerm && !todo.text.toLowerCase().includes(state.searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [state.items, state.filter, state.searchTerm]);

  // Render loading state
  if (state.isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/" className="text-blue-500 hover:text-blue-700">
          Back to Home
        </Link>
      </div>
      
      <div className="mb-6 bg-white p-6 rounded shadow-md">
        <h2 className="text-lg font-medium mb-4">Add New Todo</h2>
        <div className="flex">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
            className="flex-grow px-4 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="What needs to be done?"
            aria-label="New todo text"
          />
          <button 
            onClick={handleAddTodo}
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Add todo"
          >
            Add
          </button>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-lg font-medium mb-4">Todo List</h2>
        
        <TodoFilter
          currentFilter={state.filter}
          onFilterChange={handleFilterChange}
          searchTerm={state.searchTerm}
          onSearchChange={handleSearchChange}
        />
        
        {filteredTodos.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            {state.items.length === 0 
              ? "No todos yet. Add one above!" 
              : "No todos match your current filter."}
          </div>
        ) : (
          <ul>
            {filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
              />
            ))}
          </ul>
        )}
        
        <div className="mt-4 text-sm text-gray-600">
          <div className="flex justify-between items-center">
            <span>
              {filteredTodos.length} {filteredTodos.length === 1 ? 'item' : 'items'}
              {state.filter !== 'all' && ` (${state.filter})`}
              {state.searchTerm && ` matching "${state.searchTerm}"`}
            </span>
            <span>
              {state.items.filter(todo => todo.completed).length} of {state.items.length} completed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 
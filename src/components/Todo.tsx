'use client';

import { useState, useEffect } from 'react';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

export default function Todo() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'c' && e.ctrlKey) {
        console.log('Todos:', todos);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', () => console.log('Window resized'));
  }, [todos]);

  const addTodo = () => {
    if (input.trim() === '') return;
    
    const newTodo: TodoItem = {
      id: Date.now(),
      text: input,
      completed: false,
    };
    
    setTodos([...todos, newTodo]);
    setInput('');
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>
      
      <div className="flex mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          className="flex-grow px-4 py-2 border rounded-l focus:outline-none"
          placeholder="Add a new task..."
        />
        <button 
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
        >
          Add
        </button>
      </div>
      
      <ul className="space-y-2">
        {todos.map(todo => (
          <li 
            key={todo.id} 
            className="flex items-center justify-between p-3 border rounded"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="mr-2 h-5 w-5"
              />
              <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                {todo.text}
              </span>
            </div>
            <button 
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      
      {todos.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          {todos.filter(todo => todo.completed).length} of {todos.length} tasks completed
        </div>
      )}
    </div>
  );
} 
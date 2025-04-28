'use client';

import { TodoItem as TodoItemType } from '../types/todo';

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className="flex items-center justify-between p-3 border rounded mb-2">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="mr-2 h-5 w-5"
          aria-label={`Mark "${todo.text}" as ${todo.completed ? 'not done' : 'done'}`}
        />
        <span className={todo.completed ? 'line-through text-gray-500' : ''}>
          {todo.text}
        </span>
      </div>
      <button 
        onClick={() => onDelete(todo.id)}
        className="text-red-500 hover:text-red-700"
        aria-label={`Delete "${todo.text}"`}
      >
        Delete
      </button>
    </li>
  );
} 
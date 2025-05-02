'use client';

import React, { useState } from 'react';
import { useTodoContext } from '@/context/TodoContext';
import { TodoItem as TodoItemType } from '@/types';
import { FiCheck, FiTrash2, FiEdit, FiTag, FiCalendar, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import { Button } from './ui/Button';

export function TodoList() {
  const { state, dispatch } = useTodoContext();
  const { items: todos, filters, searchQuery } = state;
  
  // Apply filters and search
  const filteredTodos = todos.filter(todo => {
    // Filter by completion status
    if (!filters.showCompleted && todo.completed) {
      return false;
    }
    
    // Filter by categories
    if (filters.categories.length > 0 && !filters.categories.includes(todo.category)) {
      return false;
    }
    
    // Filter by priorities
    if (filters.priorities.length > 0 && !filters.priorities.includes(todo.priority)) {
      return false;
    }
    
    // Filter by tags
    if (filters.tags.length > 0 && !filters.tags.some(tag => todo.tags.includes(tag))) {
      return false;
    }
    
    // Filter by assignee
    if (filters.assignedTo && todo.assignedTo !== filters.assignedTo) {
      return false;
    }
    
    // Search
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        todo.text.toLowerCase().includes(searchLower) ||
        todo.notes.toLowerCase().includes(searchLower) ||
        todo.category.toLowerCase().includes(searchLower) ||
        todo.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });
  
  if (todos.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium text-gray-500">No todos yet</h3>
        <p className="text-gray-400 mt-2">Create your first todo to get started</p>
      </div>
    );
  }
  
  if (filteredTodos.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium text-gray-500">No matching todos</h3>
        <p className="text-gray-400 mt-2">Try adjusting your filters or search</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {filteredTodos.map(todo => (
        <TodoItem 
          key={todo.id} 
          todo={todo} 
          onToggle={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
          onEdit={(updatedTodo) => dispatch({ 
            type: 'UPDATE_TODO', 
            payload: { id: todo.id, ...updatedTodo } 
          })}
          onDelete={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}
        />
      ))}
    </div>
  );
}

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: () => void;
  onEdit: (updated: Partial<TodoItemType>) => void;
  onDelete: () => void;
}

function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { state } = useTodoContext();
  
  // Find the category of this todo
  const category = state.categories.find(cat => cat.id === todo.category);
  
  // Format dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  const dueDate = formatDate(todo.dueDate);
  const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();
  
  return (
    <div className={`
      border rounded-lg overflow-hidden transition-all duration-200
      ${todo.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'}
      ${isOverdue ? 'border-red-300' : ''}
    `}>
      <div className="p-4 flex items-start gap-3">
        {/* Checkbox */}
        <div 
          className={`
            flex-shrink-0 h-6 w-6 rounded-full border cursor-pointer 
            flex items-center justify-center transition-colors
            ${todo.completed 
              ? 'bg-green-500 border-green-500 text-white' 
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
          onClick={onToggle}
        >
          {todo.completed && <FiCheck className="h-4 w-4" />}
        </div>
        
        {/* Content */}
        <div className="flex-grow min-w-0" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <h3 className={`font-medium truncate ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {todo.text}
              </h3>
              
              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                {/* Category */}
                {category && (
                  <span 
                    className="px-2 py-1 rounded-full text-xs"
                    style={{ 
                      backgroundColor: `${category.color}20`, // 20% opacity
                      color: category.color
                    }}
                  >
                    {category.name}
                  </span>
                )}
                
                {/* Priority */}
                <span className={`
                  px-2 py-1 rounded-full text-xs
                  ${todo.priority === 'high' ? 'bg-red-100 text-red-700' : ''}
                  ${todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : ''}
                  ${todo.priority === 'low' ? 'bg-green-100 text-green-700' : ''}
                  ${todo.priority === 'urgent' ? 'bg-purple-100 text-purple-700' : ''}
                `}>
                  {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                </span>
                
                {/* Due date */}
                {dueDate && (
                  <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
                    <FiCalendar className="h-3 w-3" />
                    {dueDate}
                  </span>
                )}
                
                {/* Assignee */}
                {todo.assignedTo && (
                  <span className="text-gray-500">
                    Assigned to: {state.users.find(u => u.id === todo.assignedTo)?.name || todo.assignedTo}
                  </span>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex space-x-1 ml-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle edit logic (would open a modal/form in a real app)
                  console.log('Edit todo:', todo.id);
                }}
                leftIcon={<FiEdit className="h-4 w-4" />}
                aria-label="Edit"
                className="text-gray-400 hover:text-gray-600"
              />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                leftIcon={<FiTrash2 className="h-4 w-4" />}
                aria-label="Delete"
                className="text-gray-400 hover:text-red-500"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 ml-9 border-t border-gray-100">
          {/* Notes */}
          {todo.notes && (
            <div className="mt-2 text-sm text-gray-600 whitespace-pre-line">
              {todo.notes}
            </div>
          )}
          
          {/* Tags */}
          {todo.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              <FiTag className="h-4 w-4 text-gray-400 mr-1" />
              {todo.tags.map(tag => (
                <span 
                  key={tag}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Timestamps */}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            <div className="flex items-center">
              <FiClock className="h-3 w-3 mr-1" />
              <span>Created: {formatDate(todo.createdAt)}</span>
            </div>
            
            {todo.completed && todo.completedAt && (
              <div className="flex items-center">
                <FiCheck className="h-3 w-3 mr-1" />
                <span>Completed: {formatDate(todo.completedAt)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 
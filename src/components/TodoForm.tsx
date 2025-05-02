'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTodoContext } from '@/context/TodoContext';
import { Button } from './ui/Button';
import { TodoItem, Priority } from '@/types';

// Define the form schema using zod
const todoSchema = z.object({
  text: z.string().min(1, 'Task description is required'),
  category: z.string().default('uncategorized'),
  priority: z.enum(['low', 'medium', 'high', 'urgent'] as const).default('medium'),
  dueDate: z.string().nullable().optional(),
  notes: z.string().optional(),
  tags: z.string().optional(), // Will be split into array
  assignedTo: z.string().nullable().optional()
});

type TodoFormValues = z.infer<typeof todoSchema>;

interface TodoFormProps {
  initialValues?: Partial<TodoItem>;
  onSubmit: (data: TodoFormValues) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export function TodoForm({ 
  initialValues, 
  onSubmit, 
  onCancel, 
  submitLabel = 'Add Todo' 
}: TodoFormProps) {
  const { state } = useTodoContext();
  const { categories, users } = state;
  
  // Set up React Hook Form
  const { 
    register, 
    handleSubmit, 
    control,
    formState: { errors, isSubmitting }
  } = useForm<TodoFormValues>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      text: initialValues?.text || '',
      category: initialValues?.category || 'uncategorized',
      priority: initialValues?.priority || 'medium',
      dueDate: initialValues?.dueDate || null,
      notes: initialValues?.notes || '',
      tags: initialValues?.tags ? initialValues.tags.join(', ') : '',
      assignedTo: initialValues?.assignedTo || null
    }
  });
  
  const processFormData = (data: TodoFormValues) => {
    // Process the tags from a comma-separated string to an array
    const processedData = {
      ...data,
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
    };
    
    onSubmit(processedData);
  };
  
  return (
    <form onSubmit={handleSubmit(processFormData)} className="space-y-4">
      {/* Task Description */}
      <div>
        <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
          Task Description *
        </label>
        <input
          {...register('text')}
          id="text"
          type="text"
          placeholder="What needs to be done?"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.text && (
          <p className="mt-1 text-sm text-red-600">{errors.text.message}</p>
        )}
      </div>
      
      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          {...register('category')}
          id="category"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <div className="flex gap-4">
          {(['low', 'medium', 'high', 'urgent'] as Priority[]).map(priority => (
            <label key={priority} className="flex items-center">
              <input
                {...register('priority')}
                type="radio"
                value={priority}
                className="h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700">
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Due Date */}
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
          Due Date
        </label>
        <input
          {...register('dueDate')}
          id="dueDate"
          type="date"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          {...register('notes')}
          id="notes"
          rows={3}
          placeholder="Add any additional details..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          Tags (comma separated)
        </label>
        <input
          {...register('tags')}
          id="tags"
          type="text"
          placeholder="e.g. work, important, meeting"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* Assigned To */}
      <div>
        <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
          Assign To
        </label>
        <select
          {...register('assignedTo')}
          id="assignedTo"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Unassigned</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        
        <Button
          type="submit"
          variant="default"
          isLoading={isSubmitting}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
} 
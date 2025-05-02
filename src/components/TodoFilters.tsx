'use client';

import { ChangeEvent } from 'react';
import { TodoFilterOptions } from '../types/todo';

// Consistent: Proper interface definition
interface TodoFiltersProps {
  filter: TodoFilterOptions;
  onChange: (filter: TodoFilterOptions) => void;
}

// Inconsistent: Function using non-PascalCase naming
export default function todoFilters({ filter, onChange }: TodoFiltersProps) {
  // Consistent: Clean handler function
  const handleCheckboxChange = (field: 'showCompleted' | 'showActive') => {
    onChange({
      ...filter,
      [field]: !filter[field],
    });
  };
  
  // Inconsistent: Inline handler with less clean approach
  function searchChange(e: ChangeEvent<HTMLInputElement>) {
    var newVal = e.target.value;
    var newFilter = Object.assign({}, filter, { searchTerm: newVal });
    onChange(newFilter);
  }
  
  // Mixed: Some Tailwind (consistent), some inline styles (inconsistent)
  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-md">
      <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Filter Tasks</h2>
      
      <div className="space-y-2">
        {/* Consistent: Clean component structure */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="show-completed"
            checked={filter.showCompleted}
            onChange={() => handleCheckboxChange('showCompleted')}
            className="mr-2 h-4 w-4"
          />
          <label htmlFor="show-completed" className="text-sm text-gray-700">
            Show Completed
          </label>
        </div>
        
        {/* Inconsistent: Different markup pattern for similar elements */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            id="show-active"
            checked={filter.showActive}
            onChange={() => handleCheckboxChange('showActive')}
            style={{ marginRight: '8px', height: '16px', width: '16px' }}
          />
          <label htmlFor="show-active" style={{ fontSize: '14px', color: '#4B5563' }}>
            Show Active
          </label>
        </div>
        
        {/* Mixed: Tailwind classes with inline style */}
        <div className="mt-2">
          <input
            type="text"
            placeholder="Search tasks..."
            value={filter.searchTerm}
            onChange={searchChange}
            className="w-full px-3 py-2 border rounded text-sm"
            style={{ borderColor: '#E5E7EB' }}
          />
        </div>
      </div>
    </div>
  );
} 
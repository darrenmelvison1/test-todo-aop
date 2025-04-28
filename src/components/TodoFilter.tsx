'use client';

import { FilterType } from '../types/todo';

interface TodoFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
}

export function TodoFilter({
  currentFilter,
  onFilterChange,
  searchTerm,
  onSearchChange,
}: TodoFilterProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between mb-4 gap-2">
      <div className="flex items-center">
        <label htmlFor="filter" className="mr-2 text-sm font-medium">
          Filter:
        </label>
        <select
          id="filter"
          value={currentFilter}
          onChange={(e) => onFilterChange(e.target.value as FilterType)}
          className="px-3 py-2 border rounded"
          aria-label="Filter todos"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="flex items-center">
        <label htmlFor="search" className="mr-2 text-sm font-medium">
          Search:
        </label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="px-3 py-2 border rounded"
          placeholder="Search todos..."
          aria-label="Search todos"
        />
      </div>
    </div>
  );
} 
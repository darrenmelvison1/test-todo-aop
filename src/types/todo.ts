export interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

// Consistent interface for filtering options
export interface TodoFilterOptions {
  showCompleted: boolean;
  showActive: boolean;
  searchTerm: string;
} 
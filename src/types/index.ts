// Todo item types
export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  completedAt: string | null;
  dueDate: string | null;
  category: string;
  priority: Priority;
  tags: string[];
  notes: string;
  assignedTo: string | null;
}

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface TodoCategory {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  preferences: UserPreferences;
}

export type UserRole = 'admin' | 'user' | 'guest';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  defaultView: 'list' | 'kanban' | 'calendar';
  defaultCategory?: string;
  defaultPriority?: Priority;
}

// State management types
export interface TodoState {
  items: TodoItem[];
  categories: TodoCategory[];
  users: User[];
  loading: boolean;
  error: string | null;
  filters: TodoFilters;
  sort: SortOptions;
  selectedTodo: string | null;
  searchQuery: string;
}

export interface TodoFilters {
  showCompleted: boolean;
  categories: string[];
  priorities: Priority[];
  tags: string[];
  dueDate: DateFilter | null;
  assignedTo: string | null;
}

export type DateFilter = 
  | 'today' 
  | 'tomorrow' 
  | 'thisWeek' 
  | 'nextWeek' 
  | 'overdue' 
  | 'noDate'
  | { from: string; to: string };

export interface SortOptions {
  field: SortField;
  direction: 'asc' | 'desc';
}

export type SortField = 'createdAt' | 'dueDate' | 'priority' | 'text' | 'completedAt';

// Actions for state management
export type TodoAction =
  | { type: 'FETCH_TODOS_REQUEST' }
  | { type: 'FETCH_TODOS_SUCCESS'; payload: TodoItem[] }
  | { type: 'FETCH_TODOS_FAILURE'; payload: string }
  | { type: 'ADD_TODO'; payload: TodoItem }
  | { type: 'UPDATE_TODO'; payload: Partial<TodoItem> & { id: string } }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'SET_FILTER'; payload: Partial<TodoFilters> }
  | { type: 'SET_SORT'; payload: SortOptions }
  | { type: 'SET_SELECTED_TODO'; payload: string | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'FETCH_CATEGORIES_SUCCESS'; payload: TodoCategory[] }
  | { type: 'FETCH_USERS_SUCCESS'; payload: User[] };

// Analytics types
export interface TodoAnalytics {
  completionRate: number;
  averageCompletionTime: number;
  priorityDistribution: Record<Priority, number>;
  categoryDistribution: Record<string, number>;
  completionTrend: CompletionTrendData[];
  overdueTasks: number;
}

export interface CompletionTrendData {
  date: string;
  completed: number;
  total: number;
}

// Kanban board types
export interface KanbanColumn {
  id: string;
  title: string;
  todoIds: string[];
}

export interface KanbanBoard {
  columns: KanbanColumn[];
  columnOrder: string[];
}

// Calendar view types
export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  todoId: string;
  color: string;
} 
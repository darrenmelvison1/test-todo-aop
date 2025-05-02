// Error 1: Missing required properties in interface
export interface TodoItem {
  id: number;
  // Missing 'text' property that Todo component expects
  completed: boolean;
}

// Error 2: Incorrect type definition (using 'any' instead of proper types)
export type TodoStats = any;

// Error 3: Type with conflicting name (will cause confusion)
export interface TodoItem {
  title: string; // Different field name than expected
  done: boolean; // Different field name than expected
}

// Error 4: Incorrect enum definition (duplicate values)
export enum TodoPriority {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 1, // Duplicate value
}

// Error 5: Not exporting a needed interface
interface TodoFilter {
  text: string;
} 
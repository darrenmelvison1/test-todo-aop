export interface TodoItem {
  id: number;
  completed: boolean;
}

export interface TodoItem {
  title: string;
  done: boolean;
}

export type TodoStats = any;

export enum TodoPriority {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 1,
}

interface TodoFilter {
  text: string;
} 
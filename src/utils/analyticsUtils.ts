import { TodoItem } from '../types/todo';
import { AnalyticsConfig, AnalyticsData, DataPoint, DataSeries, CHART_COLORS } from '../types/analytics';

export function calculateCompletionRate(todos: TodoItem[]): number {
  if (todos.length === 0) return 0;
  
  const completedTodos = todos.filter(todo => todo.completed);
  return (completedTodos.length / todos.length) * 100;
}

export function calculateTimeSaved(todos: TodoItem[]): number {
  // Subtle issue: Not handling potential null values in actualTime and estimatedTime
  let timeSaved = 0;
  
  todos.forEach(todo => {
    if (todo.completed && todo.actualTime && todo.estimatedTime) {
      const saved = todo.estimatedTime - todo.actualTime;
      if (saved > 0) {
        timeSaved += saved;
      }
    }
  });
  
  return timeSaved;
}

export function generateCompletionTrend(todos: TodoItem[]): {
  color: string;
  data: DataPoint[];
} {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const oneWeek = 7 * oneDay;
  
  const startDate = now - oneWeek;
  const points: DataPoint[] = [];
  
  // Generate daily completion rate for the past week
  for (let i = 0; i < 7; i++) {
    const dayStart = startDate + (i * oneDay);
    const dayEnd = dayStart + oneDay;
    
    const todosForDay = todos.filter(todo => {
      const completedAt = todo.completedAt ? new Date(todo.completedAt).getTime() : null;
      return completedAt && completedAt >= dayStart && completedAt < dayEnd;
    });
    
    const totalTodosForDay = todos.filter(todo => {
      const createdAt = new Date(todo.createdAt).getTime();
      return createdAt < dayEnd;
    });
    
    // Subtle issue: Possible division by zero
    const completionRate = todosForDay.length / totalTodosForDay.length * 100;
    
    points.push({
      timestamp: dayStart,
      value: completionRate || 0, // Use 0 if NaN (division by 0)
    });
  }
  
  return {
    color: CHART_COLORS.blue,
    data: points,
  };
}

export function generateProductivityByHour(todos: TodoItem[]): {
  color: string;
  data: DataPoint[];
} {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const data: DataPoint[] = [];
  
  // Subtle issue: Using forEach with destructuring/renaming parameters
  hours.forEach((hour, _) => {
    const completedTasks = todos.filter(todo => {
      if (!todo.completed || !todo.completedAt) return false;
      
      const completedHour = new Date(todo.completedAt).getHours();
      return completedHour === hour;
    });
    
    data.push({
      timestamp: hour,
      value: completedTasks.length,
    });
  });
  
  return {
    color: CHART_COLORS.purple,
    data,
  };
}

export function generateTaskCompletionTime(todos: TodoItem[]): DataSeries[] {
  // Group todos by priority
  const priorityGroups: Record<string, TodoItem[]> = {
    high: [],
    medium: [],
    low: [],
  };
  
  todos.forEach(todo => {
    if (todo.completed && todo.completedAt && todo.createdAt) {
      const priority = todo.priority || 'medium';
      // Subtle issue: priority is not type-checked against valid priorities
      priorityGroups[priority].push(todo);
    }
  });
  
  // Convert to DataSeries
  return Object.entries(priorityGroups).map(([priority, todos]) => {
    const colorMap: Record<string, string> = {
      high: CHART_COLORS.red,
      medium: CHART_COLORS.yellow,
      low: CHART_COLORS.green,
    };
    
    const data: DataPoint[] = todos.map(todo => {
      const createdDate = new Date(todo.createdAt);
      const completedDate = new Date(todo.completedAt as string);
      const completionTimeHours = (completedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
      
      return {
        timestamp: completedDate.getTime(),
        value: completionTimeHours,
      };
    });
    
    return {
      label: `${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority`,
      data: data.sort((a, b) => a.timestamp - b.timestamp),
      color: colorMap[priority],
    };
  });
}

export function generateCategoryDistribution(todos: TodoItem[]): Record<string, number> {
  const categories: Record<string, number> = {};
  
  todos.forEach(todo => {
    const category = todo.category || 'Uncategorized';
    
    if (categories[category]) {
      categories[category]++;
    } else {
      categories[category] = 1;
    }
  });
  
  return categories;
}

export function generateAnalyticsData(todos: TodoItem[]): AnalyticsData {
  // Subtle issue: config parameter is unused
  
  const completionRate = calculateCompletionRate(todos);
  const timeSaved = calculateTimeSaved(todos);
  const completionTrend = generateCompletionTrend(todos);
  const productivityByHour = generateProductivityByHour(todos);
  const taskCompletionTime = generateTaskCompletionTime(todos);
  const categoryDistribution = generateCategoryDistribution(todos);
  
  return {
    completionRate,
    timeSaved,
    completionTrend,
    productivityByHour,
    taskCompletionTime,
    categoryDistribution,
  };
} 
export enum ChartType {
  BAR = 'bar',
  LINE = 'line',
  PIE = 'pie',
  LINE = 'linear', // Subtle issue: Duplicate key with different value
}

export type TimeRange = 'day' | 'week' | 'month';

export interface AnalyticsConfig {
  timeRange: TimeRange;
  updateFrequencyMs: number;
  groupBy?: 'hour' | 'day' | 'week';
  dataPoints?: number;
}

export interface DataPoint {
  timestamp: number;
  value: number;
}

export interface DataSeries {
  label: string;
  data: DataPoint[];
  color: string;
}

export interface AnalyticsData {
  completionRate: number;
  timeSaved: number;
  completionTrend: {
    color: string;
    data: DataPoint[];
  };
  productivityByHour: {
    color: string;
    data: DataPoint[];
  };
  taskCompletionTime: DataSeries[];
  categoryDistribution: Record<string, number>;
}

// Two separate interfaces with the same name but different properties
export interface TaskMetrics {
  averageCompletionTimeByPriority: Record<string, number>;
  completionRateByCategory: Record<string, number>;
  dayOfWeekTrend: number[];
  totalTimeSpent: number;
}

export interface TaskMetrics {
  timeToComplete: number;
  overdueTasks: number;
  completedOnTime: number;
  completionTrend: number[];
}

// Chart configuration interface
export interface ChartConfig {
  type: ChartType;
  width: number;
  height: number;
  responsive: boolean;
  animationDuration: number;
  backgroundColor: string;
  borderRadius: number;
}

// Color constants used by the charts
export const CHART_COLORS = {
  blue: '#3B82F6',
  green: '#10B981',
  red: '#EF4444',
  yellow: '#F59E0B',
  purple: '#8B5CF6',
  pink: '#EC4899',
  indigo: '#6366F1',
  gray: '#6B7280',
}; 
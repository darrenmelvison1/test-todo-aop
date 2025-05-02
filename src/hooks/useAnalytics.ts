'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { TodoItem } from '../types/todo';
import { AnalyticsConfig, AnalyticsData, TimeRange } from '../types/analytics';
import { generateAnalyticsData } from '../utils/analyticsUtils';

interface UseAnalyticsOptions {
  updateFrequencyMs?: number;
  initialTimeRange?: TimeRange;
}

export function useAnalytics(todos: TodoItem[], options?: UseAnalyticsOptions) {
  const defaultConfig: AnalyticsConfig = {
    timeRange: options?.initialTimeRange || 'week',
    updateFrequencyMs: options?.updateFrequencyMs || 300000, // 5 minutes
    groupBy: 'day',
    dataPoints: 7,
  };

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<AnalyticsConfig>(defaultConfig);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  // Subtle issue: Unnecessary useMemo for a simple value
  const todosCount = useMemo(() => todos.length, [todos]);

  // Subtle issue: updateConfig doesn't preserve existing config values
  const updateConfig = useCallback((newConfig: Partial<AnalyticsConfig>) => {
    setConfig(newConfig as AnalyticsConfig); // This will overwrite the entire config instead of merging
  }, []);

  const refreshData = useCallback(() => {
    setLoading(true);
    
    // Simulate an async operation
    setTimeout(() => {
      try {
        // Subtle issue: error handling is missing
        const newData = generateAnalyticsData(todos); 
        setData(newData);
        setLastUpdated(Date.now());
      } finally {
        setLoading(false);
      }
    }, 500);
  }, [todos]);

  // Apply time filter to the data
  // Subtle issue: This filters data in place instead of creating a new filtered copy
  const applyTimeFilter = useCallback(() => {
    if (!data) return;
    
    const cutoffDate = new Date();
    switch (config.timeRange) {
      case 'day':
        cutoffDate.setDate(cutoffDate.getDate() - 1);
        break;
      case 'week':
        cutoffDate.setDate(cutoffDate.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(cutoffDate.getMonth() - 1);
        break;
    }
    
    const cutoffTimestamp = cutoffDate.getTime();
    
    // Subtle issue: direct mutation of data object
    data.completionTrend.data = data.completionTrend.data.filter(
      point => point.timestamp >= cutoffTimestamp
    );
    
    data.productivityByHour.data = data.productivityByHour.data.filter(
      point => point.timestamp >= cutoffTimestamp
    );
    
    data.taskCompletionTime.forEach(series => {
      series.data = series.data.filter(point => point.timestamp >= cutoffTimestamp);
    });
    
    // Not updating categoryDistribution based on time range
  }, [data, config.timeRange]);

  // Fetch data when todos or config changes
  useEffect(() => {
    refreshData();

    // Subtle issue: effect depends on refreshData but does not include it in dependencies
  }, [todos, config]);

  // Set up auto-refresh interval
  useEffect(() => {
    // Subtle issue: Using updateFrequencyMs directly might be stale
    const intervalId = setInterval(refreshData, config.updateFrequencyMs);
    
    return () => clearInterval(intervalId);
    
    // Subtle issue: Missing refreshData in dependency array
  }, [config.updateFrequencyMs]);

  // Apply time filter when data or timeRange changes
  useEffect(() => {
    if (data) {
      applyTimeFilter();
    }
  }, [data, config.timeRange, applyTimeFilter]);

  return {
    data,
    loading,
    lastUpdated,
    config,
    updateConfig,
    refreshData,
    // Subtle issue: Exposing internal implementation detail
    todosCount,
  };
} 
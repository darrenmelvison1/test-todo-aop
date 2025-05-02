'use client';

import { useState, useEffect, useMemo } from 'react';
import { TodoItem } from '../types/todo';
import { AnalyticsConfig, ChartType } from '../types/analytics';
import { useAnalytics } from '../hooks/useAnalytics';
import { CHART_COLORS } from '../utils/analyticsUtils';

interface AnalyticsDashboardProps {
  todos: TodoItem[];
}

interface ChartProps {
  type: ChartType;
  data: Array<{ x: string; y: number; color?: string }>;
  color?: string;
}

export function AnalyticsDashboard({ todos }: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'productivity' | 'time' | 'categories'>('overview');
  const [refreshInterval, setRefreshInterval] = useState(60000);
  
  const { 
    data, 
    loading, 
    lastUpdated, 
    config, 
    updateConfig, 
    refreshData 
  } = useAnalytics(todos, { updateFrequencyMs: refreshInterval });
  
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
  };
  
  const handleTimeRangeChange = (timeRange: AnalyticsConfig['timeRange']) => {
    updateConfig({ timeRange });
  };
  
  const renderOverviewTab = () => {
    if (!data) return <div className="p-4 text-center text-gray-500">No data available</div>;
    
    return (
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Completion Rate</h3>
          <div className="flex items-end">
            <div className="text-3xl font-bold text-blue-500">{data.completionRate.toFixed(1)}%</div>
            <div className="ml-2 text-sm text-gray-500">of tasks completed</div>
          </div>
          <div className="mt-4 bg-gray-200 h-2 rounded-full">
            <div 
              className="bg-blue-500 h-2 rounded-full" 
              style={{ width: `${data.completionRate}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Time Saved</h3>
          <div className="flex items-end">
            <div className="text-3xl font-bold text-green-500">{data.timeSaved.toFixed(1)}</div>
            <div className="ml-2 text-sm text-gray-500">minutes</div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Based on average task completion time
          </div>
        </div>
        
        <div className="col-span-2 bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-700 mb-2">7-Day Trend</h3>
          {renderChart({
            type: ChartType.LINE,
            data: data.completionTrend.data.map(point => ({
              x: formatDate(point.timestamp),
              y: point.value,
            })),
            color: data.completionTrend.color,
          })}
        </div>
      </div>
    );
  };
  
  const renderProductivityTab = () => {
    if (!data) return <div className="p-4 text-center text-gray-500">No data available</div>;
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Productivity by Hour</h3>
        {renderChart({
          type: ChartType.BAR,
          data: data.productivityByHour.data.map(point => ({
            x: `${point.timestamp}:00`,
            y: point.value,
          })),
          color: data.productivityByHour.color,
        })}
      </div>
    );
  };
  
  const renderTimeTab = () => {
    if (!data || data.taskCompletionTime.length === 0) {
      return <div className="p-4 text-center text-gray-500">No completion time data available</div>;
    }
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Task Completion Time by Priority</h3>
        {data.taskCompletionTime.map((series, index) => (
          <div key={index} className="mb-6">
            <div className="flex items-center mb-2">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: series.color }}
              ></div>
              <div className="text-sm font-medium">{series.label}</div>
            </div>
            {renderChart({
              type: ChartType.LINE,
              data: series.data.map(point => ({
                x: formatDate(point.timestamp),
                y: point.value,
              })),
              color: series.color,
            })}
          </div>
        ))}
      </div>
    );
  };
  
  const renderCategoriesTab = () => {
    if (!data || Object.keys(data.categoryDistribution).length === 0) {
      return <div className="p-4 text-center text-gray-500">No category data available</div>;
    }
    
    const categories = Object.entries(data.categoryDistribution);
    const total = categories.reduce((sum, [_, count]) => sum + count, 0);
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Tasks by Category</h3>
        {renderChart({
          type: ChartType.PIE,
          data: categories.map(([category, count], index) => ({
            x: category,
            y: count,
            color: getCategoryColor(index),
          })),
        })}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {categories.map(([category, count], index) => (
            <div key={category} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: getCategoryColor(index) }}
              ></div>
              <div className="text-sm">{category}</div>
              <div className="ml-auto text-sm font-medium">
                {((count / total) * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const getCategoryColor = (index: number) => {
    const colors = Object.values(CHART_COLORS);
    return colors[index % colors.length];
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };
  
  const renderChart = ({ type, data, color }: ChartProps) => {
    if (data.length === 0) {
      return <div className="text-center text-gray-500 p-4">No data for this period</div>;
    }
    
    switch (type) {
      case ChartType.LINE:
        return (
          <div className="h-48 flex items-end">
            {data.map((point, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="text-xs text-gray-500">{point.x}</div>
                <div 
                  className="w-full mx-1" 
                  style={{ 
                    height: `${calculateHeight(point.y, data)}%`, 
                    backgroundColor: color || CHART_COLORS.blue, 
                  }}
                ></div>
              </div>
            ))}
          </div>
        );
      
      case ChartType.BAR:
        return (
          <div className="h-48 flex items-end">
            {data.map((point, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-4/5 mx-auto rounded-t" 
                  style={{ 
                    height: `${calculateHeight(point.y, data)}%`, 
                    backgroundColor: color || CHART_COLORS.purple, 
                  }}
                ></div>
                <div className="text-xs text-gray-500 mt-1">{point.x}</div>
              </div>
            ))}
          </div>
        );
      
      case ChartType.PIE:
        return (
          <div className="flex justify-center">
            <div className="w-40 h-40 rounded-full border-4 border-white shadow-inner overflow-hidden flex">
              {data.map((segment, index) => {
                const percentage = (segment.y / data.reduce((sum, d) => sum + d.y, 0)) * 100;
                return (
                  <div 
                    key={index}
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: segment.color || getCategoryColor(index),
                    }}
                  ></div>
                );
              })}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  const calculateHeight = (value: number, data: Array<{ x: string; y: number }>) => {
    const maxValue = Math.max(...data.map(d => d.y));
    return maxValue > 0 ? (value / maxValue) * 100 : 0;
  };
  
  if (loading && !data) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Task Analytics</h2>
        <div className="text-sm text-gray-500">
          Last updated: {formatTime(lastUpdated)}
        </div>
      </div>
      
      <div className="flex mb-6">
        <div className="flex space-x-2">
          <button 
            onClick={() => handleTimeRangeChange('day')}
            className={`px-3 py-1 text-sm rounded ${
              config.timeRange === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Day
          </button>
          <button 
            onClick={() => handleTimeRangeChange('week')}
            className={`px-3 py-1 text-sm rounded ${
              config.timeRange === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Week
          </button>
          <button 
            onClick={() => handleTimeRangeChange('month')}
            className={`px-3 py-1 text-sm rounded ${
              config.timeRange === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Month
          </button>
        </div>
        
        <button 
          onClick={refreshData}
          className="ml-auto px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          Refresh
        </button>
      </div>
      
      <div className="flex border-b mb-6">
        <button 
          onClick={() => handleTabChange('overview')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'overview' 
              ? 'text-blue-500 border-b-2 border-blue-500' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Overview
        </button>
        <button 
          onClick={() => handleTabChange('productivity')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'productivity' 
              ? 'text-blue-500 border-b-2 border-blue-500' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Productivity
        </button>
        <button 
          onClick={() => handleTabChange('time')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'time' 
              ? 'text-blue-500 border-b-2 border-blue-500' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Time Analysis
        </button>
        <button 
          onClick={() => handleTabChange('categories')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'categories' 
              ? 'text-blue-500 border-b-2 border-blue-500' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Categories
        </button>
      </div>
      
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'productivity' && renderProductivityTab()}
      {activeTab === 'time' && renderTimeTab()}
      {activeTab === 'categories' && renderCategoriesTab()}
    </div>
  );
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
} 
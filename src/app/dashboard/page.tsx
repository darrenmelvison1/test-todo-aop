'use client';

import React, { useState, useEffect } from 'react';
import { FiPieChart, FiCalendar, FiCheckSquare, FiClock } from 'react-icons/fi';

type StatCardProps = {
  title: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
  color: string;
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  color,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-2 text-3xl font-semibold">{value}</h3>
          <p className="mt-1 text-xs text-gray-500">{description}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const mockFetchAnalytics = (): Promise<{
  totalTasks: number;
  completedTasks: number;
  upcomingTasks: number;
  completionRate: number;
}> => {
  // This would be replaced with a real API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalTasks: 12,
        completedTasks: 8,
        upcomingTasks: 4,
        completionRate: 67,
      });
    }, 500);
  });
};

export default function Dashboard() {
  const [analytics, setAnalytics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    upcomingTasks: 0,
    completionRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await mockFetchAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome to your task overview!!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tasks"
          value={analytics.totalTasks}
          description="All tasks in your workspace"
          icon={<FiPieChart className="h-6 w-6 text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Completed"
          value={analytics.completedTasks}
          description="Tasks marked as done"
          icon={<FiCheckSquare className="h-6 w-6 text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Upcoming"
          value={analytics.upcomingTasks}
          description="Tasks to be done"
          icon={<FiClock className="h-6 w-6 text-white" />}
          color="bg-yellow-500"
        />
        <StatCard
          title="Completion Rate"
          value={`${analytics.completionRate}%`}
          description="Tasks completion percentage"
          icon={<FiCalendar className="h-6 w-6 text-white" />}
          color="bg-purple-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-500 text-sm">
          This is a placeholder for a chart or recent activity feed that would normally be here.
        </p>
        <div className="h-48 flex items-center justify-center border border-dashed border-gray-300 rounded-lg mt-4">
          <p className="text-gray-400">Activity chart would be displayed here</p>
        </div>
      </div>
    </div>
  );
} 
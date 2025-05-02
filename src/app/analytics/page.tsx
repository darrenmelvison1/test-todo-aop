'use client';

import React from 'react';
import { FiPieChart } from 'react-icons/fi';

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-gray-500">Track your productivity and task completion</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center justify-center min-h-[400px]">
        <FiPieChart className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-medium text-gray-700">Analytics Coming Soon</h2>
        <p className="text-gray-500 mt-2 text-center max-w-md">
          We're building detailed analytics to help you understand your productivity patterns and improve your workflow.
        </p>
      </div>
    </div>
  );
} 
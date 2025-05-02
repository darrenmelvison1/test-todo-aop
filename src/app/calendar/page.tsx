'use client';

import React from 'react';
import { FiCalendar } from 'react-icons/fi';

export default function CalendarPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-gray-500">View your tasks in calendar format</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center justify-center min-h-[400px]">
        <FiCalendar className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-medium text-gray-700">Calendar Coming Soon</h2>
        <p className="text-gray-500 mt-2 text-center max-w-md">
          We're working on a beautiful calendar view to help you visualize your tasks and deadlines.
        </p>
      </div>
    </div>
  );
} 
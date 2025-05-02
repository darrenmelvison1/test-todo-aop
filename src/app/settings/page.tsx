'use client';

import React from 'react';
import { FiSettings } from 'react-icons/fi';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500">Customize your experience</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center justify-center min-h-[400px]">
        <FiSettings className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-medium text-gray-700">Settings Coming Soon</h2>
        <p className="text-gray-500 mt-2 text-center max-w-md">
          We're working on comprehensive settings to allow you to customize the application to your preferences.
        </p>
      </div>
    </div>
  );
} 
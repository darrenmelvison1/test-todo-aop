'use client';

import React from 'react';
import Todo from '@/components/Todo';

export default function TodosPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Task Management</h1>
        <p className="text-gray-500">Manage your tasks and stay organized</p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <Todo />
      </div>
    </div>
  );
} 
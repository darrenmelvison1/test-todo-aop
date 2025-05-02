'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiHome, 
  FiList, 
  FiCalendar, 
  FiPieChart, 
  FiSettings,
  FiMenu,
  FiX,
  FiPlus
} from 'react-icons/fi';
import { Button } from './ui/Button';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/', icon: <FiHome /> },
  { name: 'Todo List', href: '/todos', icon: <FiList /> },
  { name: 'Calendar', href: '/calendar', icon: <FiCalendar /> },
  { name: 'Analytics', href: '/analytics', icon: <FiPieChart /> },
  { name: 'Settings', href: '/settings', icon: <FiSettings /> }
];

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Desktop Nav */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                TodoApp
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                      ${isActive 
                        ? 'border-blue-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                    `}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          
          {/* Actions */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Button 
              variant="default" 
              size="sm"
              className="ml-3"
              leftIcon={<FiPlus className="h-4 w-4" />}
            >
              New Todo
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">
                {isMobileMenuOpen ? 'Close main menu' : 'Open main menu'}
              </span>
              {isMobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-3 py-2 text-base font-medium
                    ${isActive 
                      ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700' 
                      : 'border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
            
            <div className="px-4 py-3">
              <Button 
                variant="default" 
                size="sm"
                className="w-full justify-center"
                leftIcon={<FiPlus className="h-4 w-4" />}
              >
                New Todo
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 
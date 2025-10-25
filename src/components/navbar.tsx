'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AuthButton from './AuthButton';

export default function Navbar() {
  const { user, hasCalendarPermission, requestCalendarPermission } = useAuth();

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">SIA</h1>
            </div>
            <div className="hidden md:block ml-4">
              <span className="text-gray-600 text-sm">AI Wellness Companion</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"> 
                Home
              </Link>
              {user && (
                <Link href="/chat" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                  Chat
                </Link>
              )}
            </div>
          </div>

          {/* Auth Button and Calendar Permission */}
          <div className="flex items-center gap-3">
            {user && !hasCalendarPermission && (
              <button
                onClick={requestCalendarPermission}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Connect Calendar
              </button>
            )}
            {user && hasCalendarPermission && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Calendar Connected
              </div>
            )}
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

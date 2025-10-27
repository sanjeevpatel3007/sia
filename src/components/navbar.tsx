'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { User, LogOut, LogIn, ChevronDown, Menu } from 'lucide-react';

export default function Navbar() {
  const { user, loading, signInWithGooglePopup, signOut } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle sidebar toggle for mobile
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
    // Dispatch custom event to communicate with sidebar
    window.dispatchEvent(new CustomEvent('sidebarToggle', { detail: !isSidebarOpen }));
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            {/* Mobile Sidebar Toggle Button */}
            <button
              onClick={handleSidebarToggle}
              className="lg:hidden mr-3 p-2 rounded-lg sama-bg-accent hover:sama-bg-accent-light transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} className="sama-text-primary" />
            </button>
            
            <Link href="/" className="flex items-center space-x-3">
              <div className="shrink-0">
                <h1 className="text-2xl font-bold sama-text-primary">SIA</h1>
              </div>
              <div className="hidden md:block">
                <div className="w-8 h-8 rounded-full sama-bg-accent flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full sama-bg-accent-light"></div>
                </div>
              </div>
              <div className="hidden md:block ml-2">
                <span className="sama-text-secondary text-sm font-medium">The Calm Mind Studio</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              <Link href="/" className="sama-text-secondary hover:sama-text-primary px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-gray-50"> 
                Home
              </Link>
              {user && (
                <Link href="/chat" className="sama-text-secondary hover:sama-text-primary px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-gray-50">
                  Chat with SIA
                </Link>
              )}
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            {loading ? (
              <div className="flex items-center justify-center p-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#6683AB]"></div>
              </div>
            ) : user ? (
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full sama-bg-accent flex items-center justify-center">
                  <User size={20} className="sama-text-primary" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium sama-text-primary">
                    {user.user_metadata?.full_name || 'User'}
                  </div>
                  <div className="text-xs sama-text-secondary">
                    {user.email}
                  </div>
                </div>
                <ChevronDown size={16} className={`sama-text-secondary transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <button
                onClick={signInWithGooglePopup}
                className="sama-button-primary flex items-center gap-2 px-4 py-2 text-sm"
              >
                <LogIn size={16} />
                <span className="hidden sm:inline">Sign in with Google</span>
                <span className="sm:hidden">Sign in</span>
              </button>
            )}

            {/* Dropdown Menu */}
            {isProfileOpen && user && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="text-sm font-medium sama-text-primary">
                    {user.user_metadata?.full_name || 'User'}
                  </div>
                  <div className="text-sm sama-text-secondary">
                    {user.email}
                  </div>
                </div>
                
                <div className="py-1">
                  <Link
                    href="/chat"
                    className="flex items-center px-4 py-2 text-sm sama-text-secondary hover:sama-bg-accent hover:sama-text-primary transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User size={16} className="mr-3" />
                    Chat with SIA
                  </Link>
                </div>
                
                <div className="py-1 border-t border-gray-100">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} className="mr-3" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

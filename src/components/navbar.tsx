'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { User, LogOut, LogIn, ChevronDown, Menu, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export default function Navbar() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            {/* Mobile Sidebar Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSidebarToggle}
              className="lg:hidden mr-3"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </Button>

            <Link href="/" className="flex items-center space-x-3">
              <div className="shrink-0">
                <h1 className="text-2xl font-bold text-secondary">SIA</h1>
              </div>
              <div className="hidden md:block">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-muted"></div>
                </div>
              </div>
              <div className="hidden md:block ml-2">
                <span className="text-secondary/90 text-sm font-medium">The Calm Mind Studio</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              <Link href="/" className="text-secondary/90 hover:text-secondary px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-accent">
                Home
              </Link>
              {user && (
                <Link href="/chat" className="text-secondary/90 hover:text-secondary px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-accent">
                  Chat with SIA
                </Link>
              )}
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            {loading ? (
              <div className="flex items-center justify-center p-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : user ? (
              <Button
                variant="ghost"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-accent text-accent-foreground">
                    <User size={20} />
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-foreground">
                    {user.user_metadata?.full_name || 'User'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user.email}
                  </div>
                </div>
                <ChevronDown size={16} className={`text-muted-foreground transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={signInWithGoogle}
              >
                <LogIn size={16} />
                <span className="hidden sm:inline">Sign in with Google</span>
                <span className="sm:hidden">Sign in</span>
              </Button>
            )}

            {/* Dropdown Menu */}
            {isProfileOpen && user && (
              <div className="absolute right-0 mt-2 w-64 bg-card rounded-lg shadow-lg border border-border py-2 z-50">
                <div className="px-4 py-3 border-b border-border">
                  <div className="text-sm font-medium text-foreground">
                    {user.user_metadata?.full_name || 'User'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {user.email}
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    href="/chat"
                    className="flex items-center px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User size={16} className="mr-3" />
                    Chat with SIA
                  </Link>
                </div>

                <Separator className="my-1" />

                <div className="py-1">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
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

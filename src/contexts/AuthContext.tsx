'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithGooglePopup: () => Promise<void>
  signOut: () => Promise<void>
  requestCalendarPermission: () => Promise<void>
  hasCalendarPermission: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasCalendarPermission, setHasCalendarPermission] = useState(false)

  const checkCalendarPermission = async (session: Session | null) => {
    if (!session?.user) {
      setHasCalendarPermission(false)
      return
    }

    // First check user metadata for calendar permission
    if (session.user.user_metadata?.calendar_permission_granted) {
      setHasCalendarPermission(true)
      return
    }

    // If no metadata, check if we have provider token and can access calendar
    if (!session.provider_token) {
      setHasCalendarPermission(false)
      return
    }

    try {
      // Check if we have calendar access by making a test request to Google Calendar API
      const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
        headers: {
          'Authorization': `Bearer ${session.provider_token}`,
        },
      })
      
      if (response.ok) {
        setHasCalendarPermission(true)
        // Update user metadata to indicate calendar permission
        const { error: updateError } = await supabase.auth.updateUser({
          data: { 
            calendar_permission_granted: true,
            calendar_permission_date: new Date().toISOString()
          }
        })
        
        if (updateError) {
          console.error('Error updating user metadata:', updateError.message)
        }
      } else {
        setHasCalendarPermission(false)
      }
    } catch (error) {
      console.error('Error checking calendar permission:', error)
      setHasCalendarPermission(false)
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      // Only check calendar permission if user metadata indicates it was previously granted
      if (session?.user?.user_metadata?.calendar_permission_granted) {
        checkCalendarPermission(session)
      } else {
        setHasCalendarPermission(false)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      // Only check calendar permission if user metadata indicates it was previously granted
      if (session?.user?.user_metadata?.calendar_permission_granted) {
        checkCalendarPermission(session)
      } else {
        setHasCalendarPermission(false)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) console.error('Google sign-in error:', error.message)
  }

  const signInWithGooglePopup = async () => {
    const popup = window.open(
      `${window.location.origin}/auth/popup-callback`,
      'google-auth',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    )

    if (!popup) {
      console.error('Popup blocked. Please allow popups for this site.')
      return
    }

    // Listen for messages from the popup
    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        popup.close()
        window.removeEventListener('message', messageListener)
        // The auth state will be updated automatically via onAuthStateChange
      } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
        popup.close()
        window.removeEventListener('message', messageListener)
        console.error('Google sign-in error:', event.data.error)
      }
    }

    window.addEventListener('message', messageListener)

    // Check if popup is closed manually
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed)
        window.removeEventListener('message', messageListener)
      }
    }, 1000)
  }

  const requestCalendarPermission = async () => {
    const popup = window.open(
      `${window.location.origin}/auth/calendar-popup-callback`,
      'google-calendar-auth',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    )

    if (!popup) {
      console.error('Popup blocked. Please allow popups for this site.')
      return
    }

    // Listen for messages from the popup
    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      if (event.data.type === 'GOOGLE_CALENDAR_AUTH_SUCCESS') {
        popup.close()
        window.removeEventListener('message', messageListener)
        // The auth state will be updated automatically via onAuthStateChange
      } else if (event.data.type === 'GOOGLE_CALENDAR_AUTH_ERROR') {
        popup.close()
        window.removeEventListener('message', messageListener)
        console.error('Google calendar permission error:', event.data.error)
      }
    }

    window.addEventListener('message', messageListener)

    // Check if popup is closed manually
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed)
        window.removeEventListener('message', messageListener)
      }
    }, 1000)
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Sign out error:', error.message)
  }

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signInWithGooglePopup,
    signOut,
    requestCalendarPermission,
    hasCalendarPermission,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

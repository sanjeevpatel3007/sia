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
  revokeCalendarPermission: () => Promise<void>
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

    console.log('Checking calendar permission for user:', session.user.email)
    console.log('User metadata:', session.user.user_metadata)
    console.log('Provider token available:', !!session.provider_token)

    // First check user metadata for calendar permission
    if (session.user.user_metadata?.calendar_permission_granted) {
      console.log('Calendar permission found in metadata for:', session.user.email)
      
      // If we have metadata permission but no provider token, we need to refresh the session
      if (!session.provider_token) {
        console.log('Metadata shows permission but no provider token. Refreshing session...')
        try {
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
          if (refreshError) {
            console.error('Error refreshing session:', refreshError.message)
            setHasCalendarPermission(false)
            return
          }
          
          if (refreshData.session?.provider_token) {
            console.log('Session refreshed successfully, testing calendar access...')
            // Test the refreshed token
            const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
              headers: {
                'Authorization': `Bearer ${refreshData.session.provider_token}`,
              },
            })
            
            if (response.ok) {
              console.log('Calendar access confirmed with refreshed token')
              setHasCalendarPermission(true)
            } else {
              console.log('Calendar access failed with refreshed token, removing permission metadata')
              // Remove the permission metadata since the token doesn't work
              await supabase.auth.updateUser({
                data: { 
                  calendar_permission_granted: false,
                  calendar_permission_revoked_date: new Date().toISOString()
                }
              })
              setHasCalendarPermission(false)
            }
          } else {
            console.log('No provider token after refresh, removing permission metadata')
            await supabase.auth.updateUser({
              data: { 
                calendar_permission_granted: false,
                calendar_permission_revoked_date: new Date().toISOString()
              }
            })
            setHasCalendarPermission(false)
          }
        } catch (error) {
          console.error('Error refreshing session:', error)
          setHasCalendarPermission(false)
        }
      } else {
        // We have both metadata permission and provider token, test it
        try {
          console.log('Testing calendar access for:', session.user.email)
          const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
            headers: {
              'Authorization': `Bearer ${session.provider_token}`,
            },
          })
          
          if (response.ok) {
            console.log('Calendar access confirmed for:', session.user.email)
            setHasCalendarPermission(true)
          } else {
            console.log('Calendar access failed, removing permission metadata')
            await supabase.auth.updateUser({
              data: { 
                calendar_permission_granted: false,
                calendar_permission_revoked_date: new Date().toISOString()
              }
            })
            setHasCalendarPermission(false)
          }
        } catch (error) {
          console.error('Error testing calendar access:', error)
          setHasCalendarPermission(false)
        }
      }
      return
    }

    // If no metadata permission, check if we have provider token and can access calendar
    if (!session.provider_token) {
      console.log('No provider token for:', session.user.email)
      setHasCalendarPermission(false)
      return
    }

    try {
      console.log('Testing calendar access for:', session.user.email)
      // Check if we have calendar access by making a test request to Google Calendar API
      const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
        headers: {
          'Authorization': `Bearer ${session.provider_token}`,
        },
      })
      
      console.log('Calendar test response for', session.user.email, ':', response.status, response.statusText)
      
      if (response.ok) {
        console.log('Calendar access confirmed for:', session.user.email)
        setHasCalendarPermission(true)
        
        // Update user metadata to indicate calendar permission
        console.log('Updating user metadata with calendar permission...')
        const { error: updateError } = await supabase.auth.updateUser({
          data: { 
            calendar_permission_granted: true,
            calendar_permission_date: new Date().toISOString()
          }
        })
        
        if (updateError) {
          console.error('Error updating user metadata:', updateError.message)
        } else {
          console.log('Successfully updated user metadata with calendar permission')
        }
      } else {
        console.log('Calendar access denied for:', session.user.email)
        setHasCalendarPermission(false)
      }
    } catch (error) {
      console.error('Error checking calendar permission for', session.user.email, ':', error)
      setHasCalendarPermission(false)
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      // Always check calendar permission when user is logged in
      if (session?.user) {
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
      // Always check calendar permission when user is logged in
      if (session?.user) {
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
    // Use redirect instead of popup for calendar permission
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/calendar-callback`,
        scopes: 'https://www.googleapis.com/auth/calendar.readonly',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    })
    if (error) console.error('Google calendar permission error:', error.message)
  }

  const revokeCalendarPermission = async () => {
    try {
      console.log('Revoking calendar permission for:', user?.email)
      
      // Update user metadata to remove calendar permission
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          calendar_permission_granted: false,
          calendar_permission_revoked_date: new Date().toISOString()
        }
      })
      
      if (updateError) {
        console.error('Error revoking calendar permission:', updateError.message)
        throw updateError
      }
      
      // Update local state
      setHasCalendarPermission(false)
      console.log('Calendar permission revoked successfully')
    } catch (error) {
      console.error('Error revoking calendar permission:', error)
      throw error
    }
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
    revokeCalendarPermission,
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

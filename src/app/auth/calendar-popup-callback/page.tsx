'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CalendarPopupCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCalendarAuth = async () => {
      try {
        // Get the URL parameters
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        const error = urlParams.get('error')

        if (error) {
          setError(error)
          setStatus('error')
          // Notify parent window of error
          window.opener?.postMessage({
            type: 'GOOGLE_CALENDAR_AUTH_ERROR',
            error: error
          }, window.location.origin)
          return
        }

        if (code) {
          // Exchange code for session
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError) {
            setError(exchangeError.message)
            setStatus('error')
            // Notify parent window of error
            window.opener?.postMessage({
              type: 'GOOGLE_CALENDAR_AUTH_ERROR',
              error: exchangeError.message
            }, window.location.origin)
            return
          }

          if (data.session) {
            // Test calendar access to verify permissions
            try {
              const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
                headers: {
                  'Authorization': `Bearer ${data.session.provider_token}`,
                },
              })
              
              if (response.ok) {
                // Update user metadata to indicate calendar permission granted
                const { error: updateError } = await supabase.auth.updateUser({
                  data: { 
                    calendar_permission_granted: true,
                    calendar_permission_date: new Date().toISOString()
                  }
                })
                
                if (updateError) {
                  console.error('Error updating user metadata:', updateError.message)
                }
                
                setStatus('success')
                // Notify parent window of success
                window.opener?.postMessage({
                  type: 'GOOGLE_CALENDAR_AUTH_SUCCESS',
                  session: data.session
                }, window.location.origin)
                
                // Close popup after a short delay
                setTimeout(() => {
                  window.close()
                }, 1000)
              } else {
                setError('Failed to access Google Calendar')
                setStatus('error')
                window.opener?.postMessage({
                  type: 'GOOGLE_CALENDAR_AUTH_ERROR',
                  error: 'Failed to access Google Calendar'
                }, window.location.origin)
              }
            } catch (error) {
              console.error('Error testing calendar access:', error)
              setError('Failed to access Google Calendar')
              setStatus('error')
              window.opener?.postMessage({
                type: 'GOOGLE_CALENDAR_AUTH_ERROR',
                error: 'Failed to access Google Calendar'
              }, window.location.origin)
            }
          }
        } else {
          // No code, redirect to Google OAuth with calendar scopes
          const { error: oauthError } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/auth/calendar-popup-callback`,
              scopes: 'openid email profile https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar'
            }
          })

          if (oauthError) {
            setError(oauthError.message)
            setStatus('error')
            window.opener?.postMessage({
              type: 'GOOGLE_CALENDAR_AUTH_ERROR',
              error: oauthError.message
            }, window.location.origin)
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMessage)
        setStatus('error')
        window.opener?.postMessage({
          type: 'GOOGLE_CALENDAR_AUTH_ERROR',
          error: errorMessage
        }, window.location.origin)
      }
    }

    handleCalendarAuth()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Granting Calendar Access...</h2>
            <p className="text-gray-600">Please wait while we request access to your Google Calendar.</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Success!</h2>
            <p className="text-gray-600">Calendar access granted successfully. This window will close automatically.</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Calendar Access Failed</h2>
            <p className="text-gray-600 mb-4">{error || 'An error occurred while granting calendar access.'}</p>
            <button
              onClick={() => window.close()}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Close Window
            </button>
          </>
        )}
      </div>
    </div>
  )
}

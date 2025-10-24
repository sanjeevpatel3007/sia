'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function PopupCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuth = async () => {
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
            type: 'GOOGLE_AUTH_ERROR',
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
              type: 'GOOGLE_AUTH_ERROR',
              error: exchangeError.message
            }, window.location.origin)
            return
          }

          if (data.session) {
            setStatus('success')
            // Notify parent window of success
            window.opener?.postMessage({
              type: 'GOOGLE_AUTH_SUCCESS',
              session: data.session
            }, window.location.origin)
            
            // Close popup after a short delay
            setTimeout(() => {
              window.close()
            }, 1000)
          }
        } else {
          // No code, redirect to Google OAuth
          const { error: oauthError } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/auth/popup-callback`
            }
          })

          if (oauthError) {
            setError(oauthError.message)
            setStatus('error')
            window.opener?.postMessage({
              type: 'GOOGLE_AUTH_ERROR',
              error: oauthError.message
            }, window.location.origin)
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMessage)
        setStatus('error')
        window.opener?.postMessage({
          type: 'GOOGLE_AUTH_ERROR',
          error: errorMessage
        }, window.location.origin)
      }
    }

    handleAuth()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Authenticating...</h2>
            <p className="text-gray-600">Please wait while we sign you in with Google.</p>
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
            <p className="text-gray-600">You have been signed in successfully. This window will close automatically.</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Failed</h2>
            <p className="text-gray-600 mb-4">{error || 'An error occurred during authentication.'}</p>
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

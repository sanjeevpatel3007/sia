'use client'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/navbar'
import { useEffect, useState, useRef } from 'react'

export default function Home() {
  const { user, signInWithGooglePopup } = useAuth()
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const hasProcessedUrl = useRef(false)

  useEffect(() => {
    if (hasProcessedUrl.current) return
    
    // Check for URL parameters to show notifications
    const urlParams = new URLSearchParams(window.location.search)
    const calendarPermission = urlParams.get('calendar_permission')
    const error = urlParams.get('error')

    if (calendarPermission === 'success') {
      // Use setTimeout to defer state update
      setTimeout(() => {
        setNotification({
          type: 'success',
          message: 'Calendar permission granted successfully! You can now access your Google Calendar through SIA.'
        })
      }, 0)
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
      hasProcessedUrl.current = true
    } else if (error === 'calendar_permission_failed') {
      // Use setTimeout to defer state update
      setTimeout(() => {
        setNotification({
          type: 'error',
          message: 'Failed to grant calendar permission. Please try again.'
        })
      }, 0)
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
      hasProcessedUrl.current = true
    }
  }, [])

  const handleTalkWithSIA = () => {
    if (user) {
      // User is authenticated, redirect to chat
      window.location.href = '/chat'
    } else {
      // User not authenticated, trigger Google OAuth popup
      signInWithGooglePopup()
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <Navbar />

      {/* Notification */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg ${
          notification.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className="text-sm font-medium">{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            {/* Hero Section */}
            <div className="mb-12">
              <h1 className="text-5xl font-bold mb-6" style={{ color: '#6683AB' }}>
                Stronger, Calmer. For Life.
              </h1>
              <p className="text-xl mb-8" style={{ color: '#6381A8' }}>
                Welcome to SAMA - The Calm Mind Studio. Your journey to wellness, balance, and tranquility begins here.
              </p>
            </div>



            {/* Chat with SIA Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto mb-8 border border-gray-200">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-blue-500">
                  <span className="text-white font-bold text-xl">SIA</span>
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gray-800">Meet SIA</h2>
                <p className="text-lg text-gray-600">
                  Your gentle AI wellness companion. SIA is here to guide you toward balance, calm, and wellness with patience and encouragement.
                </p>
              </div>

              <button 
                onClick={handleTalkWithSIA}
                className="w-full py-4 px-8 rounded-xl text-white font-semibold text-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 bg-blue-500 hover:bg-blue-600"
              >
                💬 Talk with SIA
              </button>
            </div>



            {/* SAMA Pillars */}
            <div className="grid md:grid-cols-5 gap-4 mb-12">
              {['Strength', 'Balance', 'Mobility', 'Endurance', 'Calm Mind'].map((pillar) => (
                <div key={pillar} className="p-4 rounded-lg shadow-sm" style={{ backgroundColor: '#FFF5EF' }}>
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#6683AB' }}>
                    <span className="text-white font-bold">{pillar[0]}</span>
                  </div>
                  <h3 className="font-semibold" style={{ color: '#6381A8' }}>{pillar}</h3>
                </div>
              ))}
            </div>
            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-6 rounded-xl shadow-sm" style={{ backgroundColor: '#FFF5EF' }}>
                <div className="text-2xl mb-3">🧘‍♀️</div>
                <h3 className="font-semibold mb-2" style={{ color: '#6683AB' }}>Book Trial</h3>
                <p className="text-sm" style={{ color: '#6381A8' }}>Experience our mindful approach</p>
              </div>
              <div className="p-6 rounded-xl shadow-sm" style={{ backgroundColor: '#FFF5EF' }}>
                <div className="text-2xl mb-3">📋</div>
                <h3 className="font-semibold mb-2" style={{ color: '#6683AB' }}>View Plans</h3>
                <p className="text-sm" style={{ color: '#6381A8' }}>Find your perfect wellness journey</p>
              </div>
              <div className="p-6 rounded-xl shadow-sm" style={{ backgroundColor: '#FFF5EF' }}>
                <div className="text-2xl mb-3">💡</div>
                <h3 className="font-semibold mb-2" style={{ color: '#6683AB' }}>Wellness Tips</h3>
                <p className="text-sm" style={{ color: '#6381A8' }}>Daily inspiration for balance</p>
              </div>
            </div>
          </div>
      </main>
    </div>
  );
}

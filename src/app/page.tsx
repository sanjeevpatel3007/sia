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
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Add top padding to account for fixed navbar */}
      <div className="pt-16">
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* Hero Section */}
          <div className="mb-16">
            {/* SAMA Logo */}
            <div className="mb-8">
              {/* <h1 className="text-6xl font-bold mb-2 sama-text-primary">SAMA</h1> */}
              {/* <div className="w-12 h-12 mx-auto mb-3 rounded-full sama-bg-accent flex items-center justify-center">
                <div className="w-6 h-6 rounded-full sama-bg-accent-light"></div>
              </div> */}
              <p className="text-lg sama-text-secondary font-medium">The Calm Mind Studio</p>
            </div>
            
            <h2 className="text-5xl font-bold mb-6 sama-text-primary">
              Stronger, Calmer. For Life.
            </h2>
            <p className="text-xl mb-8 sama-text-secondary max-w-3xl mx-auto leading-relaxed">
              A mindful wellness approach built for modern lives and better healthspan. 
              Welcome to SAMA - where balance, tranquility, and strength come together.
            </p>
          </div>

          {/* Chat with SIA Section */}
          <div className="sama-card p-8 max-w-2xl mx-auto mb-12">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full sama-bg-accent flex items-center justify-center">
                <span className="text-2xl">🧘‍♀️</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 sama-text-primary">Meet SIA</h3>
              <p className="text-lg sama-text-secondary leading-relaxed">
                Your gentle AI wellness companion. SIA is here to guide you toward balance, 
                calm, and wellness with patience and encouragement. Always ready to help you #FindYourSAMA.
              </p>
            </div>

            <button 
              onClick={handleTalkWithSIA}
              className="sama-button-primary w-full py-4 px-8 text-lg font-semibold"
            >
              💬 Talk with SIA
            </button>
          </div>

          {/* SAMA Philosophy */}
          <div className="sama-bg-accent rounded-2xl p-8 mb-12">
            <h3 className="text-3xl font-bold mb-4 sama-text-primary">What is SAMA?</h3>
            <p className="text-lg sama-text-secondary mb-4">
              SAMA (सम) is a state of calmness and tranquility of the mind, a perfect state of balance.
            </p>
            <p className="text-lg sama-text-secondary mb-4">
              We are patient and gentle by design.
            </p>
            <p className="text-lg font-medium sama-text-primary">
              Come, #FindYourSAMA
            </p>
          </div>

          {/* SAMA Pillars */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold mb-8 sama-text-primary">Our Approach - The Five Pillars</h3>
            <p className="text-lg sama-text-secondary mb-8 max-w-4xl mx-auto">
              Our signature Move. Breathe. Meditate (MBM) framework brings together evidence-backed practices 
              across five essential pillars of health and longevity.
            </p>
            <div className="grid md:grid-cols-5 gap-4">
              {[
                { name: 'Strength', icon: '💪', desc: 'Build strength, protect your body, and stay resilient.' },
                { name: 'Balance', icon: '⚖️', desc: 'Find your center and maintain stability.' },
                { name: 'Mobility', icon: '🤸', desc: 'Move freely and maintain flexibility.' },
                { name: 'Endurance', icon: '🏃', desc: 'Build lasting energy and stamina.' },
                { name: 'Calm Mind', icon: '🧘', desc: 'Cultivate peace and mental clarity.' }
              ].map((pillar) => (
                <div key={pillar.name} className="sama-bg-accent-light rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="text-3xl mb-3">{pillar.icon}</div>
                  <h4 className="font-semibold mb-2 sama-text-primary">{pillar.name}</h4>
                  <p className="text-sm sama-text-secondary">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="sama-bg-accent-light rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">🧘‍♀️</div>
              <h4 className="font-semibold mb-2 sama-text-primary">Book Trial</h4>
              <p className="text-sm sama-text-secondary">Experience our mindful approach to wellness</p>
            </div>
            <div className="sama-bg-accent-light rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">📋</div>
              <h4 className="font-semibold mb-2 sama-text-primary">View Plans</h4>
              <p className="text-sm sama-text-secondary">Find your perfect wellness journey</p>
            </div>
            <div className="sama-bg-accent-light rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">💡</div>
              <h4 className="font-semibold mb-2 sama-text-primary">Wellness Tips</h4>
              <p className="text-sm sama-text-secondary">Daily inspiration for balance and calm</p>
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}

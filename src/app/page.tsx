'use client'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/navbar'
import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'
export default function Home() {
  const { user, signInWithGoogle } = useAuth()
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
      // User not authenticated, trigger Google OAuth redirect
      signInWithGoogle()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Add top padding to account for fixed navbar */}
      <div className="pt-16">
        {/* Notification */}
      {notification && (
        <Card className={`fixed top-20 right-4 z-50 max-w-md ${
          notification.type === 'success'
            ? 'border-primary bg-primary/10'
            : 'border-destructive bg-destructive/10'
        }`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{notification.message}</span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setNotification(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* Hero Section */}
          <div className="mb-16">
            <div className="mb-8">
              <p className="text-lg text-secondary/90 font-medium">The Calm Mind Studio</p>
            </div>

            <h2 className="text-5xl font-bold mb-6 text-secondary">
              Stronger, Calmer. For Life.
            </h2>
            <p className="text-xl mb-8 text-secondary/90 max-w-3xl mx-auto leading-relaxed">
              A mindful wellness approach built for modern lives and better healthspan.
              Welcome to SAMA - where balance, tranquility, and strength come together.
            </p>
          </div>

          {/* Chat with SIA Section */}
          <Card className="p-8 max-w-2xl mx-auto mb-12">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-secondary">Meet SIA</CardTitle>
              <CardDescription className="text-lg leading-relaxed">
                Your gentle AI wellness companion. SIA is here to guide you toward balance,
                calm, and wellness with patience and encouragement. Always ready to help you #FindYourSAMA.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleTalkWithSIA}
                variant="secondary"
                size="lg"
                className="w-full"
              >
                💬 Talk with SIA
              </Button>
            </CardContent>
          </Card>

          {/* SAMA Philosophy */}
          <div className="bg-accent rounded-2xl p-8 mb-12">
            <h3 className="text-3xl font-bold mb-4 text-accent-foreground">What is SAMA?</h3>
            <p className="text-lg text-accent-foreground/90 mb-4">
              SAMA (सम) is a state of calmness and tranquility of the mind, a perfect state of balance.
            </p>
            <p className="text-lg text-accent-foreground/90 mb-4">
              We are patient and gentle by design.
            </p>
            <p className="text-lg font-medium text-accent-foreground">
              Come, #FindYourSAMA
            </p>
          </div>

          {/* SAMA Pillars */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold mb-8 text-secondary">Our Approach - The Five Pillars</h3>
            <p className="text-lg text-secondary/90 mb-8 max-w-4xl mx-auto">
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
                <Card key={pillar.name} className="bg-muted p-6 hover:shadow-md transition-shadow">
                  <div className="text-3xl mb-3">{pillar.icon}</div>
                  <h4 className="font-semibold mb-2 text-foreground">{pillar.name}</h4>
                  <p className="text-sm text-muted-foreground">{pillar.desc}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-muted p-6 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">🧘‍♀️</div>
              <h4 className="font-semibold mb-2 text-foreground">Book Trial</h4>
              <p className="text-sm text-muted-foreground">Experience our mindful approach to wellness</p>
            </Card>
            <Card className="bg-muted p-6 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">📋</div>
              <h4 className="font-semibold mb-2 text-foreground">View Plans</h4>
              <p className="text-sm text-muted-foreground">Find your perfect wellness journey</p>
            </Card>
            <Card className="bg-muted p-6 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">💡</div>
              <h4 className="font-semibold mb-2 text-foreground">Wellness Tips</h4>
              <p className="text-sm text-muted-foreground">Daily inspiration for balance and calm</p>
            </Card>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}

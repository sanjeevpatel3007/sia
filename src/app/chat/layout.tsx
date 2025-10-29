'use client'

import Navbar from '@/components/navbar'
import { ChatProvider } from '@/contexts/ChatContext'
import { usePersona } from '@/contexts/PersonaContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    const { currentPersona, loading } = usePersona()
    const router = useRouter()

    useEffect(() => {
        // Redirect to home if no persona is selected
        if (!loading && !currentPersona) {
            router.push('/')
        }
    }, [currentPersona, loading, router])

    // Show loading state while checking persona
    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-secondary/70">Loading...</p>
                </div>
            </div>
        )
    }

    // Don't render if no persona
    if (!currentPersona) {
        return null
    }

    return (
        <ChatProvider>
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="pt-16">
                    {children}
                </div>
            </div>
        </ChatProvider>
    )
}

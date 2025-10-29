import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/navbar'
import { ChatProvider } from '@/contexts/ChatContext'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    return (
        // <ProtectedRoute>
            <ChatProvider>
                <div className="min-h-screen bg-white">
                    <Navbar />
                    <div className="pt-16">
                        {children}
                    </div>
                </div>
            </ChatProvider>
        // </ProtectedRoute>
    )
}
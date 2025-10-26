import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/navbar'
import { ChatProvider } from '@/contexts/ChatContext'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            <ChatProvider>
                <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    {children}
                </div>
            </ChatProvider>
        </ProtectedRoute>
    )
}
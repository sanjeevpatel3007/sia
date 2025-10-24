import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/navbar'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                {children}
            </div>
        </ProtectedRoute>
    )
}
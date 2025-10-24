
import ChatInterface from '@/components/ChatInterface'

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
        {/* <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">
            Chat with SIA
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Your AI wellness companion is here to help
          </p>
        </div> */}
        <div className="max-w-5xl mx-auto">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}

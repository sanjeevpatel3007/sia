
import ChatInterface from '@/components/ChatInterface'

export default function ChatPage() {
  return (
    <div className=" bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
      
        <div className="max-w-5xl mx-auto">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}

import ChatInterface from '@/components/ChatInterface'
import Sidebar from '@/components/sidebar'

interface ChatPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
          <div className="max-w-5xl mx-auto">
            <ChatInterface chatId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}

import ChatInterface from '@/components/ChatInterface';
import { getSessionMessages } from '@/lib/database';

interface ChatPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;

  // Fetch messages on server side
  const messages = await getSessionMessages(id);

  return <ChatInterface chatId={id} initialMessages={messages} />;
}

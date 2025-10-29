import ChatInterface from '@/components/ChatInterface';
import { getSessionMessages } from '@/lib/database';
import { isCharacterSlug } from '@/lib/characters';

interface ChatPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;

  // For character chats, don't fetch from Supabase (they're not stored there)
  // For regular chats, fetch messages from Supabase
  const messages = isCharacterSlug(id) ? [] : await getSessionMessages(id);

  return <ChatInterface chatId={id} initialMessages={messages} />;
}

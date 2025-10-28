import { redirect } from 'next/navigation';
import { generateId } from 'ai';

export default function ChatPage() {
  // Generate a new session ID and redirect to it
  const sessionId = generateId();
  redirect(`/chat/${sessionId}`);
}

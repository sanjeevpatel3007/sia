import { NextRequest, NextResponse } from 'next/server';
import { createChatSession, addMessageToSession } from '@/lib/database';

export async function POST(req: NextRequest) {
  try {
    const { userId, initialMessage, title } = await req.json();

    if (!userId || !initialMessage) {
      return NextResponse.json(
        { error: 'User ID and initial message are required' },
        { status: 400 }
      );
    }

    // Create session first
    const session = await createChatSession(userId, title);
    
    // Add the initial message
    await addMessageToSession(session.id, userId, 'user', initialMessage.content);

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Error creating chat session:', error);
    return NextResponse.json(
      { error: 'Failed to create chat session' },
      { status: 500 }
    );
  }
}

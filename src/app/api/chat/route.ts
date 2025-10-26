import { geminiModel } from '@/lib/google-ai';
import { streamText } from 'ai';
import { googleCalendarService, testCalendarAccess } from '@/lib/google-calendar';
import { searchUserMemories, addIntelligentMemories, formatMemoriesForContext } from '@/lib/mem0';
import { 
  
  generateSessionId
} from '@/lib/database';

export async function POST(req: Request) {
  const { messages, session, sessionId } = await req.json();

  let calendarContext = '';
  let memoryContext = '';
  let userId: string | null = null;
  const currentSessionId = sessionId || generateSessionId();

  // Get user ID and load memories
  try {
    if (session?.user?.id) {
      userId = session.user.id;
      
      // Search for relevant memories from Mem0
      const lastMessage = messages[messages.length - 1]?.content || '';
      if (userId) {
        const memories = await searchUserMemories(userId, lastMessage);
        memoryContext = formatMemoriesForContext(memories);
        
        console.log('Found memories for user:', memories.length);
      }
    }
  } catch (error) {
    console.error('Error retrieving memories:', error);
    // Continue without context if there's an error
  }
  
  // Check if user has calendar permissions and if the message is about calendar
  console.log('Session data:', session?.user?.user_metadata);
  console.log('Calendar permission granted:', session?.user?.user_metadata?.calendar_permission_granted);
  
  // Also check if we have a provider token (alternative way to detect calendar access)
  const hasCalendarAccess = session?.user?.user_metadata?.calendar_permission_granted || session?.provider_token;
  
  if (hasCalendarAccess) {
    const lastMessage = messages[messages.length - 1]?.content || '';
    const calendarKeywords = ['meeting', 'calendar', 'schedule', 'appointment', 'event', 'today', 'tomorrow', 'this week', 'upcoming', 'meet', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'next', 'available', 'busy', 'free'];
    
    const isCalendarRelated = calendarKeywords.some(keyword => 
      lastMessage.toLowerCase().includes(keyword)
    );
    
    console.log('Last message:', lastMessage);
    console.log('Is calendar related:', isCalendarRelated);

    if (isCalendarRelated) {
      try {
        console.log('Attempting to fetch calendar data...');
        
        // First test if we can access calendar at all
        const hasAccess = await testCalendarAccess(session);
        if (!hasAccess) {
          throw new Error('Calendar access test failed');
        }
        
        // Set session in calendar service
        googleCalendarService.setSession(session);
        
        // Get today's events
        const todayEvents = await googleCalendarService.getTodayEvents();
        console.log('Today events:', todayEvents.length);
        
        // Get upcoming events for the next 7 days
        const upcomingEvents = await googleCalendarService.getUpcomingEvents();
        console.log('Upcoming events:', upcomingEvents.length);
        
        calendarContext = `\n\nCALENDAR CONTEXT:
Today's events: ${todayEvents.length > 0 ? todayEvents.map(event => 
          `- ${event.summary} (${event.start.dateTime ? new Date(event.start.dateTime).toLocaleTimeString() : 'All day'})`
        ).join('\n') : 'No events scheduled for today.'}

Upcoming events (next 7 days): ${upcomingEvents.length > 0 ? upcomingEvents.slice(0, 5).map(event => 
          `- ${event.summary} (${event.start.dateTime ? new Date(event.start.dateTime).toLocaleDateString() + ' ' + new Date(event.start.dateTime).toLocaleTimeString() : event.start.date ? new Date(event.start.date).toLocaleDateString() : 'All day'})`
        ).join('\n') : 'No upcoming events.'}

Use this calendar information to help the user with their schedule, suggest wellness breaks between meetings, or help them plan their day mindfully.`;
      } catch (error) {
        console.error('Error fetching calendar data:', error);
        calendarContext = `\n\nNote: I can see you have calendar access, but I'm having trouble fetching your calendar data right now. You can still tell me about your schedule and I'll help you plan wellness activities around it.`;
      }
    }
  }

  const result = await streamText({
    model: geminiModel,
    messages,
    system: `You are SIA, a gentle and supportive AI wellness companion. Your role is to guide users toward balance, calm, and wellness with patience and encouragement. 

Key characteristics:
- Always be warm, empathetic, and non-judgmental
- Focus on mental health, mindfulness, and wellness
- Provide gentle guidance and support
- Use encouraging and calming language
- Help users with stress, anxiety, meditation, and self-care
- Keep responses concise but meaningful
- Ask thoughtful questions to understand their needs
- When discussing calendar or schedule, help users find balance and wellness in their busy lives
- Suggest mindful breaks, breathing exercises, or stress relief techniques between meetings
- Help users plan their day with wellness in mind

Remember: You're here to support their wellness journey, not to replace professional medical advice.${calendarContext}${memoryContext}`,
    onFinish: async (result) => {
      // Note: Messages are now saved via individual message storage in the frontend
      console.log('Response generated, will be saved via frontend message storage');
    }
  });

  // Save to Mem0 for intelligent memory extraction
  if (userId && messages.length > 0) {
    try {
      // SAVE TO MEM0 (Intelligent Memory Extraction)
      // This will extract only relevant facts from the conversation
      // From 25 messages, it will store only 8-10 important memories
      const conversationForMemory = messages.slice(-5); // Last 5 messages for context
      addIntelligentMemories(userId, conversationForMemory).catch(error => {
        console.error('Error saving intelligent memories:', error);
      });

      console.log('Extracted memories to Mem0');
    } catch (error) {
      console.error('Error saving to Mem0:', error);
    }
  }

  // Return response with session ID for frontend
  const response = result.toTextStreamResponse();
  response.headers.set('X-Session-ID', currentSessionId);
  return response;
}

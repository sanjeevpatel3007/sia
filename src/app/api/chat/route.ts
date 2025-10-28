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
      
      // Search for relevant memories from Mem0 - use broader search terms
      const lastMessage = messages[messages.length - 1]?.content || '';
      const searchQuery = lastMessage || 'user information personal details education routine schedule';
      
      if (userId) {
        const memories = await searchUserMemories(userId, searchQuery);
        memoryContext = formatMemoriesForContext(memories);
        
        console.log('Found memories for user:', memories.length);
        console.log('Memory context:', memoryContext);
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
        console.log('Attempting to fetch comprehensive calendar data...');
        
        // First test if we can access calendar at all
        const hasAccess = await testCalendarAccess(session);
        if (!hasAccess) {
          throw new Error('Calendar access test failed');
        }
        
        // Set session in calendar service
        googleCalendarService.setSession(session);
        
        // Get comprehensive calendar data (past, today, future) in one call
        const calendarData = await googleCalendarService.getAllCalendarData();
        console.log('Calendar data fetched - Past:', calendarData.pastEvents.length, 'Today:', calendarData.todayEvents.length, 'Upcoming:', calendarData.upcomingEvents.length);
        
        // Format comprehensive calendar context
        const formatEvent = (event: { summary: string; start: { dateTime?: string; date?: string } }) => {
          const timeStr = event.start.dateTime 
            ? new Date(event.start.dateTime).toLocaleTimeString() 
            : event.start.date 
            ? new Date(event.start.date).toLocaleDateString() 
            : 'All day';
          return `- ${event.summary} (${timeStr})`;
        };

        calendarContext = `\n\nCOMPREHENSIVE CALENDAR CONTEXT:

RECENT PAST EVENTS (last 30 days): ${calendarData.pastEvents.length > 0 ? 
          calendarData.pastEvents.slice(-5).map(formatEvent).join('\n') : 'No recent past events.'}

TODAY'S EVENTS: ${calendarData.todayEvents.length > 0 ? 
          calendarData.todayEvents.map(formatEvent).join('\n') : 'No events scheduled for today.'}

UPCOMING EVENTS (next 30 days): ${calendarData.upcomingEvents.length > 0 ? 
          calendarData.upcomingEvents.slice(0, 10).map(formatEvent).join('\n') : 'No upcoming events.'}

TOTAL EVENTS IN RANGE: ${calendarData.allEvents.length} events

Use this comprehensive calendar information to help the user with their schedule, suggest wellness breaks between meetings, help them plan their day mindfully, and provide insights about their calendar patterns. You can reference past events for context and upcoming events for planning.`;
      } catch (error) {
        console.error('Error fetching calendar data:', error);
        
        // Provide more specific error messages based on the error type
        let errorMessage = '';
        if (error instanceof Error) {
          if (error.message.includes('insufficient authentication scopes')) {
            errorMessage = 'I notice your calendar permissions may need to be refreshed. Please click the calendar button to reconnect your Google Calendar for the best experience.';
          } else if (error.message.includes('access token')) {
            errorMessage = 'I\'m having trouble accessing your calendar right now. Please try clicking the calendar button to refresh your connection.';
          } else if (error.message.includes('Calendar access test failed')) {
            errorMessage = 'I can see you have calendar access, but I\'m having trouble fetching your calendar data right now. Please try reconnecting your calendar using the calendar button.';
          } else {
            errorMessage = 'I\'m experiencing some technical difficulties accessing your calendar. You can still tell me about your schedule and I\'ll help you plan wellness activities around it.';
          }
        } else {
          errorMessage = 'I\'m having trouble accessing your calendar right now. You can still tell me about your schedule and I\'ll help you plan wellness activities around it.';
        }
        
        calendarContext = `\n\nCALENDAR NOTE: ${errorMessage}`;
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
- Keep responses VERY SHORT by default (1–2 sentences) unless explicitly asked to elaborate
- Ask thoughtful questions to understand their needs
- When discussing calendar or schedule, help users find balance and wellness in their busy lives
- Suggest mindful breaks, breathing exercises, or stress relief techniques between meetings
- Help users plan their day with wellness in mind
- ALWAYS use the user's MEMORIES first. If memories contain personal information (name, education, routine, etc.), reference them directly in your response.
- When user asks about their basic info, education, or personal details, check memories first and provide information from there.
- If calendar access is unavailable, DO NOT suggest connecting the calendar or mention calendar buttons. Work with what you know from memory and user-provided information.

Remember: You're here to support their wellness journey, not to replace professional medical advice.${memoryContext}${calendarContext}`,
    onFinish: async () => {
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

export interface CalendarEvent {
  id: string
  summary: string
  start: {
    dateTime?: string
    date?: string
  }
  end: {
    dateTime?: string
    date?: string
  }
  description?: string
  location?: string
  attendees?: Array<{
    email: string
    displayName?: string
    responseStatus: string
  }>
}

export interface CalendarList {
  id: string
  summary: string
  primary?: boolean
}

export class GoogleCalendarService {
  private session: { provider_token?: string } | null = null;

  setSession(session: { provider_token?: string } | null) {
    this.session = session;
  }

  private getAccessToken(): string | null {
    const token = this.session?.provider_token;
    if (!token) {
      console.error('No provider token in session');
      return null;
    }
    
    // Basic token validation
    if (token.length < 50) {
      console.error('Token seems too short:', token.length);
      return null;
    }
    
    if (!token.startsWith('ya29.') && !token.startsWith('1//')) {
      console.error('Token format seems incorrect, should start with ya29. or 1//, got:', token.substring(0, 10));
      return null;
    }
    
    console.log('Using access token:', token.substring(0, 20) + '...');
    console.log('Token length:', token.length);
    return token;
  }

  async getCalendarList(): Promise<CalendarList[]> {
    const token = this.getAccessToken()
    if (!token) {
      console.error('No access token available');
      throw new Error('No access token available')
    }

    console.log('Making calendar list request with token:', token.substring(0, 20) + '...');
    console.log('Token length:', token.length);
    console.log('Token starts with:', token.substring(0, 10));

    try {
      const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      console.log('Calendar list response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Calendar list API error:', errorText);
        console.error('Response headers:', Object.fromEntries(response.headers.entries()));
        
        // Parse the error to get more details
        try {
          const errorData = JSON.parse(errorText);
          console.error('Parsed error data:', errorData);
          
          if (errorData.error?.message?.includes('insufficient authentication scopes')) {
            throw new Error(`OAuth scopes issue: ${errorData.error.message}. Please re-grant calendar permissions with the correct scopes.`);
          }
        } catch (parseError) {
          console.error('Could not parse error response:', parseError);
        }
        
        throw new Error(`Failed to fetch calendar list: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const data = await response.json()
      console.log('Calendar list data:', data);
      return data.items || []
    } catch (error) {
      console.error('Calendar API request failed:', error);
      throw error;
    }
  }

  async getEvents(calendarId: string = 'primary', timeMin?: string, timeMax?: string, maxResults: number = 50): Promise<CalendarEvent[]> {
    const token = this.getAccessToken()
    if (!token) {
      console.error('No access token available')
      throw new Error('No access token available')
    }

    const params = new URLSearchParams({
      maxResults: maxResults.toString(),
      singleEvents: 'true',
      orderBy: 'startTime',
    })

    if (timeMin) params.append('timeMin', timeMin)
    if (timeMax) params.append('timeMax', timeMax)

    const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${params}`
    console.log('Fetching events from:', url)

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Calendar API error:', response.status, response.statusText, errorText)
      throw new Error(`Failed to fetch events: ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Calendar API response:', data)
    return data.items || []
  }

  async getTodayEvents(calendarId: string = 'primary'): Promise<CalendarEvent[]> {
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

    console.log('Fetching today events from:', startOfDay.toISOString(), 'to:', endOfDay.toISOString())
    return this.getEvents(
      calendarId,
      startOfDay.toISOString(),
      endOfDay.toISOString()
    )
  }

  async getUpcomingEvents(calendarId: string = 'primary', days: number = 7): Promise<CalendarEvent[]> {
    const now = new Date()
    const future = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000))

    return this.getEvents(
      calendarId,
      now.toISOString(),
      future.toISOString()
    )
  }

  async searchEvents(query: string, calendarId: string = 'primary', maxResults: number = 20): Promise<CalendarEvent[]> {
    const token = this.getAccessToken()
    if (!token) throw new Error('No access token available')

    const params = new URLSearchParams({
      q: query,
      maxResults: maxResults.toString(),
      singleEvents: 'true',
      orderBy: 'startTime',
    })

    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to search events: ${response.statusText}`)
    }

    const data = await response.json()
    return data.items || []
  }
}

export const googleCalendarService = new GoogleCalendarService()

// Test function to verify calendar access
export async function testCalendarAccess(
  session: { provider_token?: string } | null
): Promise<{ success: boolean; error?: string; details?: unknown }> {
  try {
    console.log('Testing calendar access with session:', {
      hasToken: !!session?.provider_token,
      tokenPreview: session?.provider_token
        ? session.provider_token.substring(0, 20) + '...'
        : undefined,
    });
    
    if (!session?.provider_token) {
      return { 
        success: false, 
        error: 'No provider token available',
        details: { session: session }
      };
    }
    
    googleCalendarService.setSession(session);
    const calendars = await googleCalendarService.getCalendarList();
    console.log('Calendar access test successful. Found calendars:', calendars.length);
    return { success: true, details: { calendarCount: calendars.length } };
  } catch (error) {
    console.error('Calendar access test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: { session: session, error: error }
    };
  }
}

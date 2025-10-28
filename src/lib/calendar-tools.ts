import { z } from 'zod';
import { googleCalendarService } from './google-calendar';

/**
 * Calendar Tools for AI Agent
 * These tools allow the AI to fetch calendar information when needed
 */

// Tool: Get Today's Events
export const getTodayEventsTool = {
  description: "Get all events scheduled for today from the user's Google Calendar. Use this when the user asks about today's schedule, meetings, or appointments.",
  parameters: z.object({}),
  execute: async () => {
    try {
      const events = await googleCalendarService.getTodayEvents();

      if (events.length === 0) {
        return {
          success: true,
          message: "No events scheduled for today.",
          events: []
        };
      }

      const formattedEvents = events.map(event => ({
        summary: event.summary,
        startTime: event.start.dateTime
          ? new Date(event.start.dateTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          : 'All day',
        endTime: event.end.dateTime
          ? new Date(event.end.dateTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          : 'All day',
        location: event.location || 'No location specified',
        description: event.description || ''
      }));

      return {
        success: true,
        message: `Found ${events.length} event${events.length > 1 ? 's' : ''} for today.`,
        events: formattedEvents
      };
    } catch (error) {
      console.error('Error fetching today events:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch calendar events',
        events: []
      };
    }
  }
};

// Tool: Get Upcoming Events
export const getUpcomingEventsTool = {
  description: "Get upcoming events from the user's Google Calendar for the next few days. Use this when the user asks about their upcoming schedule, this week's meetings, or future appointments.",
  parameters: z.object({
    days: z.number()
      .optional()
      .default(7)
      .describe('Number of days to look ahead (default: 7)')
  }),
  execute: async ({ days = 7 }: { days?: number }) => {
    try {
      const events = await googleCalendarService.getUpcomingEvents('primary', days);

      if (events.length === 0) {
        return {
          success: true,
          message: `No events scheduled for the next ${days} day${days > 1 ? 's' : ''}.`,
          events: []
        };
      }

      const formattedEvents = events.slice(0, 10).map(event => ({
        summary: event.summary,
        date: event.start.dateTime
          ? new Date(event.start.dateTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
          : event.start.date || 'Unknown date',
        startTime: event.start.dateTime
          ? new Date(event.start.dateTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          : 'All day',
        endTime: event.end.dateTime
          ? new Date(event.end.dateTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          : 'All day',
        location: event.location || 'No location specified'
      }));

      return {
        success: true,
        message: `Found ${events.length} upcoming event${events.length > 1 ? 's' : ''} (showing first 10).`,
        events: formattedEvents
      };
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch upcoming events',
        events: []
      };
    }
  }
};

// Tool: Search Calendar Events
export const searchCalendarEventsTool = {
  description: "Search for specific events in the user's Google Calendar by keyword or topic. Use this when the user asks about specific meetings, appointments, or events by name.",
  parameters: z.object({
    query: z.string().describe('Search query (e.g., "team meeting", "dentist", "John")'),
    maxResults: z.number().optional().default(10).describe('Maximum number of results to return (default: 10)')
  }),
  execute: async ({ query, maxResults = 10 }: { query: string; maxResults?: number }) => {
    try {
      const events = await googleCalendarService.searchEvents(query, 'primary', maxResults);

      if (events.length === 0) {
        return {
          success: true,
          message: `No events found matching "${query}".`,
          events: []
        };
      }

      const formattedEvents = events.map(event => ({
        summary: event.summary,
        date: event.start.dateTime
          ? new Date(event.start.dateTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
          : event.start.date || 'Unknown date',
        startTime: event.start.dateTime
          ? new Date(event.start.dateTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          : 'All day',
        location: event.location || 'No location specified',
        attendees: event.attendees?.length || 0
      }));

      return {
        success: true,
        message: `Found ${events.length} event${events.length > 1 ? 's' : ''} matching "${query}".`,
        events: formattedEvents
      };
    } catch (error) {
      console.error('Error searching calendar events:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to search calendar events',
        events: []
      };
    }
  }
};

// Tool: Get Events in Date Range
export const getEventsInRangeTool = {
  description: "Get events within a specific date range from the user's Google Calendar. Use this when the user asks about events in a specific time period.",
  parameters: z.object({
    startDate: z.string().describe('Start date in ISO format (e.g., "2025-01-15T00:00:00Z")'),
    endDate: z.string().describe('End date in ISO format (e.g., "2025-01-20T23:59:59Z")'),
    maxResults: z.number().optional().default(50).describe('Maximum number of events to return')
  }),
  execute: async ({ startDate, endDate, maxResults = 50 }: { startDate: string; endDate: string; maxResults?: number }) => {
    try {
      const events = await googleCalendarService.getEvents('primary', startDate, endDate, maxResults);

      if (events.length === 0) {
        return {
          success: true,
          message: "No events found in the specified date range.",
          events: []
        };
      }

      const formattedEvents = events.map(event => ({
        summary: event.summary,
        date: event.start.dateTime
          ? new Date(event.start.dateTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
          : event.start.date || 'Unknown date',
        startTime: event.start.dateTime
          ? new Date(event.start.dateTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          : 'All day',
        endTime: event.end.dateTime
          ? new Date(event.end.dateTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          : 'All day',
        location: event.location || 'No location specified'
      }));

      return {
        success: true,
        message: `Found ${events.length} event${events.length > 1 ? 's' : ''} in the specified range.`,
        events: formattedEvents
      };
    } catch (error) {
      console.error('Error fetching events in range:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch events in date range',
        events: []
      };
    }
  }
};

// Export all tools in a format ready for AI SDK
export const calendarTools = {
  getTodayEvents: getTodayEventsTool,
  getUpcomingEvents: getUpcomingEventsTool,
  searchCalendarEvents: searchCalendarEventsTool,
  getEventsInRange: getEventsInRangeTool,
};

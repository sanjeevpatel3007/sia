import { z } from 'zod';
import { dummyCalendarService } from './dummy-calendar';
import { tool } from 'ai';
import { getPersonaById } from './persona-calendars';

/**
 * Dummy Calendar Tools for AI Agent
 * These tools return mock calendar data for showcase purposes
 */

// Tool: Get Today's Events
const getTodayEventsTool = tool({
  description: "Get all events scheduled for today from the user's calendar. Use this when the user asks about today's schedule, meetings, or appointments.",
  parameters: z.object({}),
  execute: async () => {
    try {
      const events = dummyCalendarService.getTodayEvents();

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
          ? new Date(event.start.dateTime).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              timeZone: 'Asia/Kolkata'
            })
          : 'All day',
        endTime: event.end.dateTime
          ? new Date(event.end.dateTime).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              timeZone: 'Asia/Kolkata'
            })
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
});

// Tool: Get Upcoming Events
const getUpcomingEventsTool = tool({
  description: "Get upcoming events from the user's calendar for the next few days. Use this when the user asks about their upcoming schedule, this week's meetings, or future appointments.",
  parameters: z.object({
    days: z.number()
      .optional()
      .default(7)
      .describe('Number of days to look ahead (default: 7)')
  }),
  execute: async ({ days = 7 }: { days?: number }) => {
    try {
      const events = dummyCalendarService.getUpcomingEvents('primary', days);

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
          ? new Date(event.start.dateTime).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              timeZone: 'Asia/Kolkata'
            })
          : event.start.date || 'Unknown date',
        startTime: event.start.dateTime
          ? new Date(event.start.dateTime).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              timeZone: 'Asia/Kolkata'
            })
          : 'All day',
        endTime: event.end.dateTime
          ? new Date(event.end.dateTime).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              timeZone: 'Asia/Kolkata'
            })
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
});

// Tool: Search Calendar Events
const searchCalendarEventsTool = tool({
  description: "Search for specific events in the user's calendar by keyword or topic. Use this when the user asks about specific meetings, appointments, or events by name.",
  parameters: z.object({
    query: z.string().describe('Search query (e.g., "team meeting", "meditation", "yoga")'),
    maxResults: z.number().optional().default(10).describe('Maximum number of results to return (default: 10)')
  }),
  execute: async ({ query, maxResults = 10 }: { query: string; maxResults?: number }) => {
    try {
      const events = dummyCalendarService.searchEvents(query, 'primary', maxResults);

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
          ? new Date(event.start.dateTime).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              timeZone: 'Asia/Kolkata'
            })
          : event.start.date || 'Unknown date',
        startTime: event.start.dateTime
          ? new Date(event.start.dateTime).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              timeZone: 'Asia/Kolkata'
            })
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
});

// Tool: Get Events in Date Range
const getEventsInRangeTool = tool({
  description: "Get events within a specific date range from the user's calendar. Use this when the user asks about events in a specific time period.",
  parameters: z.object({
    startDate: z.string().describe('Start date in ISO format (e.g., "2025-01-15T00:00:00Z")'),
    endDate: z.string().describe('End date in ISO format (e.g., "2025-01-20T23:59:59Z")'),
    maxResults: z.number().optional().default(50).describe('Maximum number of events to return')
  }),
  execute: async ({ startDate, endDate, maxResults = 50 }: { startDate: string; endDate: string; maxResults?: number }) => {
    try {
      const events = dummyCalendarService.getEvents('primary', startDate, endDate, maxResults);

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
          ? new Date(event.start.dateTime).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              timeZone: 'Asia/Kolkata'
            })
          : event.start.date || 'Unknown date',
        startTime: event.start.dateTime
          ? new Date(event.start.dateTime).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              timeZone: 'Asia/Kolkata'
            })
          : 'All day',
        endTime: event.end.dateTime
          ? new Date(event.end.dateTime).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              timeZone: 'Asia/Kolkata'
            })
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
});

// Tool: Check Availability for Booking
const checkAvailabilityTool = tool({
  description: "Check if a specific time slot is available by comparing persona's calendar with Sama Studio schedule. Returns conflicts if the persona is busy or if the class time slot is not available at Sama Studio. Use this before suggesting booking times.",
  parameters: z.object({
    date: z.string().describe('Date in format YYYY-MM-DD (e.g., "2025-10-30")'),
    timeSlot: z.string().describe('Time slot in format HH:MM-HH:MM (e.g., "08:00-09:00")'),
    className: z.string().optional().describe('Optional: Specific class name to check at Sama Studio (e.g., "Yoga & Calm Mind Practice")')
  }),
  execute: async ({ date, timeSlot, className }: { date: string; timeSlot: string; className?: string }) => {
    try {
      // Parse the date
      const targetDate = new Date(date);
      const dayOfMonth = targetDate.getDate();

      // Get current persona schedule
      const persona = dummyCalendarService.getCurrentPersona();

      if (!persona) {
        return {
          success: false,
          message: "No persona selected. Please select a persona first.",
          conflicts: []
        };
      }

      // Check if persona is busy at this time
      const personaConflicts = persona.schedule.filter(
        item => item.day === dayOfMonth && item.timeSlot === timeSlot
      );

      // Get Sama Studio schedule for this time slot
      const [startTime, endTime] = timeSlot.split("-");
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      const eventStart = new Date(targetDate);
      eventStart.setHours(startHour, startMinute, 0, 0);

      const eventEnd = new Date(targetDate);
      eventEnd.setHours(endHour, endMinute, 0, 0);

      const samaEvents = dummyCalendarService.getEvents(
        'primary',
        eventStart.toISOString(),
        eventEnd.toISOString()
      );

      // Filter Sama Studio events for this exact time slot
      const samaConflicts = samaEvents.filter(event => {
        if (!event.start.dateTime || !event.end.dateTime) return false;
        const eventStartTime = new Date(event.start.dateTime);
        const eventEndTime = new Date(event.end.dateTime);
        return eventStartTime.getHours() === startHour &&
               eventStartTime.getMinutes() === startMinute &&
               eventEndTime.getHours() === endHour &&
               eventEndTime.getMinutes() === endMinute &&
               (!className || event.summary.toLowerCase().includes(className.toLowerCase()));
      });

      const hasPersonaConflict = personaConflicts.length > 0;
      const hasSamaClass = samaConflicts.length > 0;

      if (hasPersonaConflict && !hasSamaClass) {
        return {
          success: false,
          available: false,
          message: `${persona.name} is busy at ${timeSlot} (${personaConflicts[0].event}), and there's no ${className || 'class'} at Sama Studio during this time.`,
          personaConflicts: personaConflicts.map(c => c.event),
          samaClassesAvailable: [],
          suggestion: "Please check other available time slots."
        };
      } else if (hasPersonaConflict) {
        return {
          success: false,
          available: false,
          message: `${persona.name} is already busy at ${timeSlot} on ${date} with: ${personaConflicts[0].event}`,
          personaConflicts: personaConflicts.map(c => c.event),
          samaClassesAvailable: samaConflicts.map(e => e.summary),
          suggestion: "Please choose a different time when they are free."
        };
      } else if (!hasSamaClass) {
        return {
          success: false,
          available: false,
          message: `${persona.name} is free, but there's no ${className || 'class'} scheduled at Sama Studio at ${timeSlot} on ${date}.`,
          personaConflicts: [],
          samaClassesAvailable: [],
          suggestion: "Please check the Sama Studio schedule for available classes."
        };
      } else {
        return {
          success: true,
          available: true,
          message: `Great! ${persona.name} is available at ${timeSlot} on ${date}, and there is "${samaConflicts[0].summary}" at Sama Studio.`,
          personaConflicts: [],
          samaClassesAvailable: samaConflicts.map(e => e.summary),
          suggestion: "This time slot works perfectly!"
        };
      }

    } catch (error) {
      console.error('Error checking availability:', error);
      return {
        success: false,
        available: false,
        message: error instanceof Error ? error.message : 'Failed to check availability',
        conflicts: []
      };
    }
  }
});

// Tool: Find Available Time Slots
const findAvailableSlotsTool = tool({
  description: "Find all available time slots for a persona on a specific date or range of days. Shows when the persona is free AND when Sama Studio has classes. Use this to suggest alternative booking times when there are conflicts.",
  parameters: z.object({
    startDate: z.string().describe('Start date in format YYYY-MM-DD'),
    days: z.number().optional().default(7).describe('Number of days to check (default: 7)'),
    className: z.string().optional().describe('Optional: Filter for specific class type (e.g., "Yoga", "Pilates")')
  }),
  execute: async ({ startDate, days = 7, className }: { startDate: string; days?: number; className?: string }) => {
    try {
      const persona = dummyCalendarService.getCurrentPersona();

      if (!persona) {
        return {
          success: false,
          message: "No persona selected.",
          availableSlots: []
        };
      }

      const availableSlots: Array<{date: string; timeSlot: string; className: string}> = [];
      const currentDate = new Date(startDate);

      // Check each day
      for (let i = 0; i < days; i++) {
        const dayOfMonth = currentDate.getDate();
        const dateStr = currentDate.toISOString().split('T')[0];

        // Get all Sama Studio events for this day
        const dayStart = new Date(currentDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(currentDate);
        dayEnd.setHours(23, 59, 59, 999);

        const samaEvents = dummyCalendarService.getEvents(
          'primary',
          dayStart.toISOString(),
          dayEnd.toISOString()
        );

        // Get persona's busy slots for this day
        const personaBusySlots = persona.schedule
          .filter(item => item.day === dayOfMonth)
          .map(item => item.timeSlot);

        // Check each Sama Studio event
        samaEvents.forEach(event => {
          if (!event.start.dateTime || !event.end.dateTime) return;

          // Skip if className filter doesn't match
          if (className && !event.summary.toLowerCase().includes(className.toLowerCase())) {
            return;
          }

          const startTime = new Date(event.start.dateTime);
          const endTime = new Date(event.end.dateTime);

          const timeSlot = `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}-${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;

          // Check if persona is free at this time
          if (!personaBusySlots.includes(timeSlot)) {
            availableSlots.push({
              date: dateStr,
              timeSlot: timeSlot,
              className: event.summary
            });
          }
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      if (availableSlots.length === 0) {
        return {
          success: true,
          message: `No available time slots found for ${persona.name} in the next ${days} days${className ? ` for ${className}` : ''}.`,
          availableSlots: []
        };
      }

      // Group by date for better readability
      const groupedSlots = availableSlots.reduce((acc, slot) => {
        if (!acc[slot.date]) acc[slot.date] = [];
        acc[slot.date].push(`${slot.timeSlot} - ${slot.className}`);
        return acc;
      }, {} as Record<string, string[]>);

      return {
        success: true,
        message: `Found ${availableSlots.length} available time slot${availableSlots.length > 1 ? 's' : ''} for ${persona.name}.`,
        availableSlots: groupedSlots,
        totalSlots: availableSlots.length
      };

    } catch (error) {
      console.error('Error finding available slots:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to find available slots',
        availableSlots: []
      };
    }
  }
});

// Export all tools in a format ready for AI SDK
export const dummyCalendarTools = {
  getTodayEvents: getTodayEventsTool,
  getUpcomingEvents: getUpcomingEventsTool,
  searchCalendarEvents: searchCalendarEventsTool,
  getEventsInRange: getEventsInRangeTool,
  checkAvailability: checkAvailabilityTool,
  findAvailableSlots: findAvailableSlotsTool,
};

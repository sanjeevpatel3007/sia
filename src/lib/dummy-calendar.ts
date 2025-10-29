/**
 * Dummy Calendar Service
 * Returns mock calendar data for showcase purposes
 */

interface DummyEvent {
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  location?: string;
  description?: string;
  attendees?: Array<{ email: string }>;
}

// Mock events data
const mockEvents: DummyEvent[] = [
  {
    summary: "Morning Meditation",
    start: { dateTime: new Date(new Date().setHours(7, 0, 0)).toISOString() },
    end: { dateTime: new Date(new Date().setHours(7, 30, 0)).toISOString() },
    location: "Home",
    description: "Daily mindfulness practice",
  },
  {
    summary: "Team Standup",
    start: { dateTime: new Date(new Date().setHours(10, 0, 0)).toISOString() },
    end: { dateTime: new Date(new Date().setHours(10, 30, 0)).toISOString() },
    location: "Conference Room A",
    description: "Daily team sync",
    attendees: [
      { email: "alice@example.com" },
      { email: "bob@example.com" },
    ],
  },
  {
    summary: "Lunch Break",
    start: { dateTime: new Date(new Date().setHours(12, 30, 0)).toISOString() },
    end: { dateTime: new Date(new Date().setHours(13, 30, 0)).toISOString() },
    location: "Cafeteria",
    description: "Time to recharge",
  },
  {
    summary: "Yoga Session",
    start: { dateTime: new Date(new Date().setHours(18, 0, 0)).toISOString() },
    end: { dateTime: new Date(new Date().setHours(19, 0, 0)).toISOString() },
    location: "Wellness Center",
    description: "Evening relaxation and stretching",
  },
  {
    summary: "Client Presentation",
    start: {
      dateTime: new Date(
        new Date().setDate(new Date().getDate() + 1)
      ).toISOString(),
    },
    end: {
      dateTime: new Date(
        new Date(new Date().setDate(new Date().getDate() + 1)).setHours(15, 0)
      ).toISOString(),
    },
    location: "Zoom",
    description: "Q4 Project Review",
    attendees: [
      { email: "client@company.com" },
      { email: "manager@example.com" },
    ],
  },
  {
    summary: "Therapy Appointment",
    start: {
      dateTime: new Date(
        new Date(new Date().setDate(new Date().getDate() + 2)).setHours(16, 0)
      ).toISOString(),
    },
    end: {
      dateTime: new Date(
        new Date(new Date().setDate(new Date().getDate() + 2)).setHours(17, 0)
      ).toISOString(),
    },
    location: "Dr. Smith's Office",
    description: "Monthly check-in",
  },
  {
    summary: "Weekend Hike",
    start: {
      dateTime: new Date(
        new Date(new Date().setDate(new Date().getDate() + 5)).setHours(8, 0)
      ).toISOString(),
    },
    end: {
      dateTime: new Date(
        new Date(new Date().setDate(new Date().getDate() + 5)).setHours(12, 0)
      ).toISOString(),
    },
    location: "Mountain Trail",
    description: "Nature therapy and exercise",
  },
  {
    summary: "Book Club Meeting",
    start: {
      dateTime: new Date(
        new Date(new Date().setDate(new Date().getDate() + 6)).setHours(19, 0)
      ).toISOString(),
    },
    end: {
      dateTime: new Date(
        new Date(new Date().setDate(new Date().getDate() + 6)).setHours(20, 30)
      ).toISOString(),
    },
    location: "Community Center",
    description: "Discussing 'The Power of Now'",
    attendees: [
      { email: "reader1@example.com" },
      { email: "reader2@example.com" },
    ],
  },
];

class DummyCalendarService {
  /**
   * Get events for today
   */
  getTodayEvents(): DummyEvent[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return mockEvents.filter((event) => {
      const eventDate = new Date(event.start.dateTime || event.start.date || "");
      return eventDate >= today && eventDate < tomorrow;
    });
  }

  /**
   * Get upcoming events for the next N days
   */
  getUpcomingEvents(calendarId: string, days: number = 7): DummyEvent[] {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return mockEvents.filter((event) => {
      const eventDate = new Date(event.start.dateTime || event.start.date || "");
      return eventDate >= now && eventDate <= futureDate;
    });
  }

  /**
   * Search events by query
   */
  searchEvents(
    query: string,
    calendarId: string,
    maxResults: number = 10
  ): DummyEvent[] {
    const lowerQuery = query.toLowerCase();

    return mockEvents
      .filter(
        (event) =>
          event.summary.toLowerCase().includes(lowerQuery) ||
          event.description?.toLowerCase().includes(lowerQuery) ||
          event.location?.toLowerCase().includes(lowerQuery)
      )
      .slice(0, maxResults);
  }

  /**
   * Get events in a date range
   */
  getEvents(
    calendarId: string,
    startDate: string,
    endDate: string,
    maxResults: number = 50
  ): DummyEvent[] {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return mockEvents
      .filter((event) => {
        const eventDate = new Date(
          event.start.dateTime || event.start.date || ""
        );
        return eventDate >= start && eventDate <= end;
      })
      .slice(0, maxResults);
  }
}

export const dummyCalendarService = new DummyCalendarService();

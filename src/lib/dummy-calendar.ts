/**
 * Dummy Calendar Service
 * Returns Sama Studio wellness schedule for showcase purposes
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

// Sama Studio monthly schedule template
// This template repeats every month
const samaStudioSchedule = [
  { day: 1, timeSlot: "08:00-09:00", activity: "Aerial Fitness" },
  { day: 1, timeSlot: "10:00-11:00", activity: "Wall Pilates" },
  { day: 1, timeSlot: "16:00-17:00", activity: "Reformer Pilates" },
  { day: 1, timeSlot: "18:00-19:00", activity: "Mindful Strength Training" },
  { day: 2, timeSlot: "08:00-09:00", activity: "Aerial Fitness" },
  { day: 2, timeSlot: "10:00-11:00", activity: "Wall Pilates" },
  { day: 2, timeSlot: "18:00-19:00", activity: "Calm Mind Practice" },
  { day: 3, timeSlot: "08:00-09:00", activity: "Mindful Strength Training" },
  { day: 3, timeSlot: "10:00-11:00", activity: "Calm Mind Practice" },
  { day: 3, timeSlot: "16:00-17:00", activity: "Aerial Fitness" },
  { day: 4, timeSlot: "10:00-11:00", activity: "Yoga & Calm Mind Practice" },
  { day: 4, timeSlot: "16:00-17:00", activity: "Aerial Fitness" },
  { day: 4, timeSlot: "18:00-19:00", activity: "Mindful Strength Training" },
  { day: 5, timeSlot: "08:00-09:00", activity: "Calm Mind Practice" },
  { day: 5, timeSlot: "10:00-11:00", activity: "Reformer Pilates" },
  { day: 5, timeSlot: "16:00-17:00", activity: "Wall Pilates" },
  { day: 5, timeSlot: "19:30-20:30", activity: "Yoga & Calm Mind Practice" },
  { day: 6, timeSlot: "10:00-11:00", activity: "Mindful Strength Training" },
  { day: 6, timeSlot: "16:00-17:00", activity: "Calm Mind Practice" },
  { day: 6, timeSlot: "19:30-20:30", activity: "Reformer Pilates" },
  { day: 7, timeSlot: "10:00-11:00", activity: "Mindful Strength Training" },
  { day: 7, timeSlot: "16:00-17:00", activity: "Wall Pilates" },
  { day: 7, timeSlot: "18:00-19:00", activity: "Yoga & Calm Mind Practice" },
  { day: 7, timeSlot: "19:30-20:30", activity: "Calm Mind Practice" },
  { day: 8, timeSlot: "08:00-09:00", activity: "Aerial Fitness" },
  { day: 8, timeSlot: "10:00-11:00", activity: "Yoga & Calm Mind Practice" },
  { day: 8, timeSlot: "18:00-19:00", activity: "Reformer Pilates" },
  { day: 8, timeSlot: "19:30-20:30", activity: "Calm Mind Practice" },
  { day: 9, timeSlot: "08:00-09:00", activity: "Reformer Pilates" },
  { day: 9, timeSlot: "16:00-17:00", activity: "Calm Mind Practice" },
  { day: 9, timeSlot: "18:00-19:00", activity: "Aerial Fitness" },
  { day: 9, timeSlot: "19:30-20:30", activity: "Wall Pilates" },
  { day: 10, timeSlot: "08:00-09:00", activity: "Wall Pilates" },
  { day: 10, timeSlot: "10:00-11:00", activity: "Reformer Pilates" },
  { day: 10, timeSlot: "19:30-20:30", activity: "Calm Mind Practice" },
  { day: 11, timeSlot: "08:00-09:00", activity: "Mindful Strength Training" },
  { day: 11, timeSlot: "10:00-11:00", activity: "Wall Pilates" },
  { day: 11, timeSlot: "16:00-17:00", activity: "Aerial Fitness" },
  { day: 12, timeSlot: "10:00-11:00", activity: "Wall Pilates" },
  { day: 12, timeSlot: "16:00-17:00", activity: "Aerial Fitness" },
  { day: 12, timeSlot: "18:00-19:00", activity: "Yoga & Calm Mind Practice" },
  { day: 12, timeSlot: "19:30-20:30", activity: "Mindful Strength Training" },
  { day: 13, timeSlot: "10:00-11:00", activity: "Mindful Strength Training" },
  { day: 13, timeSlot: "16:00-17:00", activity: "Reformer Pilates" },
  { day: 13, timeSlot: "18:00-19:00", activity: "Aerial Fitness" },
  { day: 14, timeSlot: "08:00-09:00", activity: "Calm Mind Practice" },
  { day: 14, timeSlot: "10:00-11:00", activity: "Reformer Pilates" },
  { day: 14, timeSlot: "16:00-17:00", activity: "Mindful Strength Training" },
  { day: 14, timeSlot: "18:00-19:00", activity: "Aerial Fitness" },
  { day: 15, timeSlot: "08:00-09:00", activity: "Calm Mind Practice" },
  { day: 15, timeSlot: "16:00-17:00", activity: "Wall Pilates" },
  { day: 15, timeSlot: "18:00-19:00", activity: "Yoga & Calm Mind Practice" },
  { day: 15, timeSlot: "19:30-20:30", activity: "Aerial Fitness" },
  { day: 16, timeSlot: "08:00-09:00", activity: "Wall Pilates" },
  { day: 16, timeSlot: "10:00-11:00", activity: "Reformer Pilates" },
  { day: 16, timeSlot: "18:00-19:00", activity: "Calm Mind Practice" },
  { day: 16, timeSlot: "19:30-20:30", activity: "Yoga & Calm Mind Practice" },
  { day: 17, timeSlot: "10:00-11:00", activity: "Wall Pilates" },
  { day: 17, timeSlot: "16:00-17:00", activity: "Aerial Fitness" },
  { day: 17, timeSlot: "18:00-19:00", activity: "Mindful Strength Training" },
  { day: 17, timeSlot: "19:30-20:30", activity: "Calm Mind Practice" },
  { day: 18, timeSlot: "08:00-09:00", activity: "Aerial Fitness" },
  { day: 18, timeSlot: "10:00-11:00", activity: "Mindful Strength Training" },
  { day: 18, timeSlot: "19:30-20:30", activity: "Wall Pilates" },
  { day: 19, timeSlot: "08:00-09:00", activity: "Yoga & Calm Mind Practice" },
  { day: 19, timeSlot: "10:00-11:00", activity: "Wall Pilates" },
  { day: 19, timeSlot: "16:00-17:00", activity: "Calm Mind Practice" },
  { day: 19, timeSlot: "19:30-20:30", activity: "Aerial Fitness" },
  { day: 20, timeSlot: "08:00-09:00", activity: "Aerial Fitness" },
  { day: 20, timeSlot: "10:00-11:00", activity: "Mindful Strength Training" },
  { day: 20, timeSlot: "16:00-17:00", activity: "Calm Mind Practice" },
  { day: 20, timeSlot: "18:00-19:00", activity: "Yoga & Calm Mind Practice" },
  { day: 21, timeSlot: "10:00-11:00", activity: "Mindful Strength Training" },
  { day: 21, timeSlot: "16:00-17:00", activity: "Wall Pilates" },
  { day: 21, timeSlot: "19:30-20:30", activity: "Aerial Fitness" },
  { day: 22, timeSlot: "08:00-09:00", activity: "Reformer Pilates" },
  { day: 22, timeSlot: "18:00-19:00", activity: "Wall Pilates" },
  { day: 22, timeSlot: "19:30-20:30", activity: "Calm Mind Practice" },
  { day: 23, timeSlot: "08:00-09:00", activity: "Aerial Fitness" },
  { day: 23, timeSlot: "10:00-11:00", activity: "Reformer Pilates" },
  { day: 23, timeSlot: "16:00-17:00", activity: "Yoga & Calm Mind Practice" },
  { day: 24, timeSlot: "08:00-09:00", activity: "Wall Pilates" },
  { day: 24, timeSlot: "16:00-17:00", activity: "Aerial Fitness" },
  { day: 24, timeSlot: "19:30-20:30", activity: "Yoga & Calm Mind Practice" },
  { day: 25, timeSlot: "08:00-09:00", activity: "Wall Pilates" },
  { day: 25, timeSlot: "10:00-11:00", activity: "Calm Mind Practice" },
  { day: 25, timeSlot: "16:00-17:00", activity: "Mindful Strength Training" },
  { day: 25, timeSlot: "19:30-20:30", activity: "Aerial Fitness" },
  { day: 26, timeSlot: "08:00-09:00", activity: "Reformer Pilates" },
  { day: 26, timeSlot: "10:00-11:00", activity: "Aerial Fitness" },
  { day: 26, timeSlot: "16:00-17:00", activity: "Yoga & Calm Mind Practice" },
  { day: 26, timeSlot: "19:30-20:30", activity: "Wall Pilates" },
  { day: 27, timeSlot: "10:00-11:00", activity: "Aerial Fitness" },
  { day: 27, timeSlot: "16:00-17:00", activity: "Reformer Pilates" },
  { day: 27, timeSlot: "18:00-19:00", activity: "Mindful Strength Training" },
  { day: 28, timeSlot: "10:00-11:00", activity: "Aerial Fitness" },
  { day: 28, timeSlot: "16:00-17:00", activity: "Mindful Strength Training" },
  { day: 28, timeSlot: "19:30-20:30", activity: "Wall Pilates" },
  { day: 29, timeSlot: "10:00-11:00", activity: "Mindful Strength Training" },
  { day: 29, timeSlot: "18:00-19:00", activity: "Yoga & Calm Mind Practice" },
  { day: 29, timeSlot: "19:30-20:30", activity: "Calm Mind Practice" },
  { day: 30, timeSlot: "08:00-09:00", activity: "Yoga & Calm Mind Practice" },
  { day: 30, timeSlot: "18:00-19:00", activity: "Wall Pilates" },
  { day: 30, timeSlot: "19:30-20:30", activity: "Reformer Pilates" },
  { day: 31, timeSlot: "08:00-09:00", activity: "Yoga & Calm Mind Practice" },
  { day: 31, timeSlot: "10:00-11:00", activity: "Aerial Fitness" },
  { day: 31, timeSlot: "16:00-17:00", activity: "Calm Mind Practice" },
  { day: 31, timeSlot: "19:30-20:30", activity: "Reformer Pilates" },
];

class DummyCalendarService {
  /**
   * Generate events for a specific date range based on the template
   */
  private generateEvents(startDate: Date, endDate: Date): DummyEvent[] {
    const events: DummyEvent[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfMonth = currentDate.getDate();

      // Find all activities for this day from the template
      const dayActivities = samaStudioSchedule.filter(
        (item) => item.day === dayOfMonth
      );

      dayActivities.forEach((activity) => {
        const [startTime, endTime] = activity.timeSlot.split("-");
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const [endHour, endMinute] = endTime.split(":").map(Number);

        const eventStart = new Date(currentDate);
        eventStart.setHours(startHour, startMinute, 0, 0);

        const eventEnd = new Date(currentDate);
        eventEnd.setHours(endHour, endMinute, 0, 0);

        events.push({
          summary: activity.activity,
          start: { dateTime: eventStart.toISOString() },
          end: { dateTime: eventEnd.toISOString() },
          location: "Sama Studio",
          description: `Wellness activity at Sama Studio - ${activity.activity}`,
        });
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return events;
  }

  /**
   * Get events for today
   */
  getTodayEvents(): DummyEvent[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.generateEvents(today, tomorrow);
  }

  /**
   * Get upcoming events for the next N days
   */
  getUpcomingEvents(calendarId: string, days: number = 7): DummyEvent[] {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const futureDate = new Date(now);
    futureDate.setDate(futureDate.getDate() + days);

    return this.generateEvents(now, futureDate);
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

    // Generate events for the next 30 days
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const futureDate = new Date(now);
    futureDate.setDate(futureDate.getDate() + 30);

    const allEvents = this.generateEvents(now, futureDate);

    return allEvents
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

    return this.generateEvents(start, end).slice(0, maxResults);
  }

  /**
   * Get all events for a specific month
   */
  getMonthEvents(year: number, month: number): DummyEvent[] {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0); // Last day of month

    return this.generateEvents(startDate, endDate);
  }
}

export const dummyCalendarService = new DummyCalendarService();

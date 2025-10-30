import { z } from "zod";
import { tool } from "ai";
import { dummyCalendarService } from "./dummy-calendar";

// Dummy booking tool: simulates booking and always returns success
const bookTimeSlotTool = tool({
  description:
    "Confirm a booking for an activity at Sama Studio. Use after availability is confirmed. Returns a success confirmation without making any real booking.",
  inputSchema: z.object({
    date: z
      .string()
      .describe('Date in format YYYY-MM-DD (e.g., "2025-10-30")'),
    timeSlot: z
      .string()
      .describe('Time slot in format HH:MM-HH:MM (e.g., "08:00-09:00")'),
    className: z
      .string()
      .describe('Class or activity name to book (e.g., "Yoga & Calm Mind Practice")'),
  }),
  execute: async ({
    date,
    timeSlot,
    className,
  }: {
    date: string;
    timeSlot: string;
    className: string;
  }) => {
    const persona = dummyCalendarService.getCurrentPersona();

    // Simulate success with a simple confirmation object
    const confirmation = {
      id: `bk_${Date.now()}`,
      date,
      timeSlot,
      className,
      location: "Sama Studio",
      persona: persona ? { id: persona.id, name: persona.name } : null,
    };

    return {
      success: true,
      booked: true,
      message: `Booked ${className} at ${timeSlot} on ${date}${
        persona ? ` for ${persona.name}` : ""
      } at Sama Studio.`,
      confirmation,
    };
  },
});

export const dummyBookingTools = {
  bookTimeSlot: bookTimeSlotTool,
};



"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin } from "lucide-react";
import { dummyCalendarService } from "@/lib/dummy-calendar";
import { usePersona } from "@/contexts/PersonaContext";

interface CalendarEvent {
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
}

export default function CalendarSidebar() {
  const { currentPersona } = usePersona();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Set the persona for the dummy calendar service
  useEffect(() => {
    if (currentPersona) {
      dummyCalendarService.setPersona(currentPersona.id);
    }
  }, [currentPersona]);

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [firstDayOfMonth, daysInMonth]);

  // Navigate to previous month
  const previousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Check if date is today
  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  // Check if date is selected
  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear()
    );
  };

  // Handle date selection
  const selectDate = (day: number) => {
    if (day) {
      setSelectedDate(new Date(currentYear, currentMonth, day));
    }
  };

  // Get upcoming events
  const upcomingEvents = useMemo(() => {
    const events = dummyCalendarService.getUpcomingEvents("primary", 14);
    return events;
  }, []);

  // Format time
  const formatTime = (dateTime?: string) => {
    if (!dateTime) return "All day";
    const date = new Date(dateTime);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Format date for event display
  const formatEventDate = (dateTime?: string, dateStr?: string) => {
    const date = new Date(dateTime || dateStr || "");
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
  };

  // Group events by date
  const groupedEvents = useMemo(() => {
    const groups: { [key: string]: CalendarEvent[] } = {};

    upcomingEvents.forEach((event) => {
      const dateKey = formatEventDate(event.start.dateTime, event.start.date);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
    });

    return groups;
  }, [upcomingEvents]);

  return (
    <div className="w-80 h-full bg-background border-l border-border flex flex-col overflow-hidden">
      {/* Calendar Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Calendar
          </h2>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="text-xs px-3 py-1 rounded-full border border-border hover:bg-muted transition-colors"
          >
            Today
          </button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={previousMonth}
            className="p-1 hover:bg-muted rounded transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-medium">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-muted rounded transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
            <div
              key={index}
              className="text-xs font-medium text-muted-foreground text-center py-1"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((day, index) => (
            <button
              key={index}
              onClick={() => selectDate(day as number)}
              disabled={!day}
              className={`
                aspect-square flex items-center justify-center text-sm rounded-full transition-colors
                ${!day ? "invisible" : ""}
                ${isToday(day as number) ? "bg-primary text-primary-foreground font-bold" : ""}
                ${isSelected(day as number) && !isToday(day as number) ? "bg-muted ring-2 ring-primary" : ""}
                ${day && !isToday(day as number) && !isSelected(day as number) ? "hover:bg-muted" : ""}
              `}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
          Upcoming Events
        </h3>

        {Object.keys(groupedEvents).length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-8">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>No upcoming events</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedEvents).map(([dateLabel, events]) => (
              <div key={dateLabel}>
                <div className="text-xs font-semibold text-muted-foreground mb-2">
                  {dateLabel}
                </div>
                <div className="space-y-2">
                  {events.map((event, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="font-medium text-sm mb-1">
                        {event.summary}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatTime(event.start.dateTime)}
                          {event.end.dateTime && (
                            <> - {formatTime(event.end.dateTime)}</>
                          )}
                        </span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

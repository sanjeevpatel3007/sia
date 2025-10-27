'use client'

import { Calendar } from "lucide-react";

export default function CalendarButton() {
  return (
    <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors flex items-center gap-2">
      <Calendar className="w-5 h-5" />
        Calendar
    </button>
  );
}
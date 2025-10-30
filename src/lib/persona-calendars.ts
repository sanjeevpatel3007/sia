/**
 * Persona-based Calendar Schedules
 * Different user personas with their unique schedules
 */

export interface PersonaScheduleItem {
  day: number;
  timeSlot: string;
  event: string;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  schedule: PersonaScheduleItem[];
}

// Sheela - Pregnant woman balancing work and wellness
const sheelaSchedule: PersonaScheduleItem[] = [
  // Day 1 - CONFLICT: 10:00-11:00 (Sama has Wall Pilates)
  { day: 1, timeSlot: "10:00-11:00", event: "Team Meeting" },
  { day: 1, timeSlot: "13:00-14:00", event: "Client Call" },
  { day: 1, timeSlot: "15:00-16:00", event: "Design Work" },

  // Day 2 - CONFLICT: 18:00-19:00 (Sama has Calm Mind Practice)
  { day: 2, timeSlot: "09:00-10:00", event: "Morning Walk" },
  { day: 2, timeSlot: "13:00-14:00", event: "Freelance Project" },
  { day: 2, timeSlot: "18:00-19:00", event: "Doctor Appointment" },

  // Day 3 - CONFLICT: 08:00-09:00 (Sama has Mindful Strength Training)
  { day: 3, timeSlot: "08:00-09:00", event: "Email Follow-up" },
  { day: 3, timeSlot: "14:00-15:00", event: "Client Call" },
  { day: 3, timeSlot: "17:00-18:00", event: "Rest Time" },

  // Day 4 - CONFLICT: 16:00-17:00 (Sama has Aerial Fitness)
  { day: 4, timeSlot: "11:00-12:00", event: "Prenatal Checkup" },
  { day: 4, timeSlot: "16:00-17:00", event: "Family Time" },
  { day: 4, timeSlot: "20:00-21:00", event: "Reading Hour" },

  // Day 5 - CONFLICT: 10:00-11:00 (Sama has Reformer Pilates)
  { day: 5, timeSlot: "10:00-11:00", event: "Team Standup" },
  { day: 5, timeSlot: "14:00-15:00", event: "Design Review" },
  { day: 5, timeSlot: "17:00-18:00", event: "Evening Walk" },

  // Day 6 - CONFLICT: 16:00-17:00 (Sama has Calm Mind Practice)
  { day: 6, timeSlot: "09:00-10:00", event: "Freelance Work" },
  { day: 6, timeSlot: "16:00-17:00", event: "Client Presentation" },
  { day: 6, timeSlot: "20:00-21:00", event: "Dinner with Partner" },

  // Day 7 - CONFLICT: 10:00-11:00 (Sama has Mindful Strength Training)
  { day: 7, timeSlot: "10:00-11:00", event: "Project Planning" },
  { day: 7, timeSlot: "13:00-14:00", event: "Lunch Meeting" },
  { day: 7, timeSlot: "17:00-18:00", event: "Rest Time" },

  // Day 8 - CONFLICT: 18:00-19:00 (Sama has Reformer Pilates)
  { day: 8, timeSlot: "09:00-10:00", event: "Design Work" },
  { day: 8, timeSlot: "13:00-14:00", event: "Team Sync" },
  { day: 8, timeSlot: "18:00-19:00", event: "Parenting Workshop" },

  // Day 9 - CONFLICT: 08:00-09:00 (Sama has Reformer Pilates)
  { day: 9, timeSlot: "08:00-09:00", event: "Client Call" },
  { day: 9, timeSlot: "14:00-15:00", event: "Freelance Project" },
  { day: 9, timeSlot: "19:00-20:00", event: "Evening Walk" },

  // Day 10 - CONFLICT: 10:00-11:00 (Sama has Reformer Pilates)
  { day: 10, timeSlot: "10:00-11:00", event: "Doctor Appointment" },
  { day: 10, timeSlot: "15:00-16:00", event: "Design Work" },
  { day: 10, timeSlot: "20:00-21:00", event: "Family Time" },

  // Day 11 - CONFLICT: 08:00-09:00 (Sama has Mindful Strength Training)
  { day: 11, timeSlot: "08:00-09:00", event: "Morning Email" },
  { day: 11, timeSlot: "13:00-14:00", event: "Client Meeting" },
  { day: 11, timeSlot: "17:00-18:00", event: "Rest Time" },

  // Day 12 - CONFLICT: 16:00-17:00 (Sama has Aerial Fitness)
  { day: 12, timeSlot: "09:00-10:00", event: "Freelance Work" },
  { day: 12, timeSlot: "16:00-17:00", event: "Team Review" },
  { day: 12, timeSlot: "20:00-21:00", event: "Reading Hour" },

  // Day 13 - CONFLICT: 18:00-19:00 (Sama has Aerial Fitness)
  { day: 13, timeSlot: "10:00-11:00", event: "Design Work" },
  { day: 13, timeSlot: "14:00-15:00", event: "Client Call" },
  { day: 13, timeSlot: "18:00-19:00", event: "Prenatal Class" },

  // Day 14 - CONFLICT: 10:00-11:00 (Sama has Reformer Pilates)
  { day: 14, timeSlot: "10:00-11:00", event: "Sprint Planning" },
  { day: 14, timeSlot: "15:00-16:00", event: "Project Work" },
  { day: 14, timeSlot: "19:00-20:00", event: "Evening Walk" },

  // Day 15 - CONFLICT: 08:00-09:00 (Sama has Calm Mind Practice)
  { day: 15, timeSlot: "08:00-09:00", event: "Team Standup" },
  { day: 15, timeSlot: "13:00-14:00", event: "Design Review" },
  { day: 15, timeSlot: "17:00-18:00", event: "Rest Time" },

  // Day 16 - CONFLICT: 10:00-11:00 (Sama has Reformer Pilates)
  { day: 16, timeSlot: "10:00-11:00", event: "Client Presentation" },
  { day: 16, timeSlot: "14:00-15:00", event: "Freelance Work" },
  { day: 16, timeSlot: "20:00-21:00", event: "Family Dinner" },

  // Day 17 - CONFLICT: 16:00-17:00 (Sama has Aerial Fitness)
  { day: 17, timeSlot: "09:00-10:00", event: "Email Follow-up" },
  { day: 17, timeSlot: "16:00-17:00", event: "Doctor Appointment" },
  { day: 17, timeSlot: "19:00-20:00", event: "Evening Walk" },

  // Day 18 - CONFLICT: 08:00-09:00 (Sama has Aerial Fitness)
  { day: 18, timeSlot: "08:00-09:00", event: "Morning Meeting" },
  { day: 18, timeSlot: "13:00-14:00", event: "Design Work" },
  { day: 18, timeSlot: "17:00-18:00", event: "Rest Time" },

  // Day 19 - CONFLICT: 10:00-11:00 (Sama has Wall Pilates)
  { day: 19, timeSlot: "10:00-11:00", event: "Team Sync" },
  { day: 19, timeSlot: "14:00-15:00", event: "Client Call" },
  { day: 19, timeSlot: "20:00-21:00", event: "Reading Hour" },

  // Day 20 - CONFLICT: 08:00-09:00 (Sama has Aerial Fitness)
  { day: 20, timeSlot: "08:00-09:00", event: "Prenatal Checkup" },
  { day: 20, timeSlot: "13:00-14:00", event: "Freelance Project" },
  { day: 20, timeSlot: "17:00-18:00", event: "Family Time" },

  // Day 21 - CONFLICT: 10:00-11:00 (Sama has Mindful Strength Training)
  { day: 21, timeSlot: "10:00-11:00", event: "Project Planning" },
  { day: 21, timeSlot: "15:00-16:00", event: "Design Work" },
  { day: 21, timeSlot: "19:00-20:00", event: "Evening Walk" },

  // Day 22 - CONFLICT: 18:00-19:00 (Sama has Wall Pilates)
  { day: 22, timeSlot: "09:00-10:00", event: "Client Meeting" },
  { day: 22, timeSlot: "13:00-14:00", event: "Team Review" },
  { day: 22, timeSlot: "18:00-19:00", event: "Parenting Class" },

  // Day 23 - CONFLICT: 10:00-11:00 (Sama has Reformer Pilates)
  { day: 23, timeSlot: "10:00-11:00", event: "Sprint Retrospective" },
  { day: 23, timeSlot: "14:00-15:00", event: "Freelance Work" },
  { day: 23, timeSlot: "20:00-21:00", event: "Rest Time" },

  // Day 24 - CONFLICT: 08:00-09:00 (Sama has Wall Pilates)
  { day: 24, timeSlot: "08:00-09:00", event: "Team Standup" },
  { day: 24, timeSlot: "13:00-14:00", event: "Design Review" },
  { day: 24, timeSlot: "17:00-18:00", event: "Evening Walk" },

  // Day 25 - CONFLICT: 10:00-11:00 (Sama has Calm Mind Practice)
  { day: 25, timeSlot: "10:00-11:00", event: "Doctor Appointment" },
  { day: 25, timeSlot: "14:00-15:00", event: "Client Call" },
  { day: 25, timeSlot: "19:00-20:00", event: "Family Dinner" },

  // Day 26 - CONFLICT: 16:00-17:00 (Sama has Yoga & Calm Mind Practice)
  { day: 26, timeSlot: "09:00-10:00", event: "Freelance Project" },
  { day: 26, timeSlot: "16:00-17:00", event: "Client Presentation" },
  { day: 26, timeSlot: "20:00-21:00", event: "Reading Hour" },

  // Day 27 - CONFLICT: 10:00-11:00 (Sama has Aerial Fitness)
  { day: 27, timeSlot: "10:00-11:00", event: "Team Meeting" },
  { day: 27, timeSlot: "14:00-15:00", event: "Design Work" },
  { day: 27, timeSlot: "19:00-20:00", event: "Rest Time" },

  // Day 28 - CONFLICT: 16:00-17:00 (Sama has Mindful Strength Training)
  { day: 28, timeSlot: "08:00-09:00", event: "Morning Email" },
  { day: 28, timeSlot: "16:00-17:00", event: "Sprint Planning" },
  { day: 28, timeSlot: "20:00-21:00", event: "Evening Walk" },

  // Day 29 - CONFLICT: 18:00-19:00 (Sama has Yoga & Calm Mind Practice)
  { day: 29, timeSlot: "10:00-11:00", event: "Client Call" },
  { day: 29, timeSlot: "13:00-14:00", event: "Freelance Work" },
  { day: 29, timeSlot: "18:00-19:00", event: "Prenatal Class" },

  // Day 30 - CONFLICT: 08:00-09:00 (Sama has Yoga & Calm Mind Practice)
  { day: 30, timeSlot: "08:00-09:00", event: "Doctor Appointment" },
  { day: 30, timeSlot: "13:00-14:00", event: "Design Review" },
  { day: 30, timeSlot: "17:00-18:00", event: "Family Time" },

  // Day 31 - CONFLICT: 10:00-11:00 (Sama has Aerial Fitness)
  { day: 31, timeSlot: "10:00-11:00", event: "Team Retrospective" },
  { day: 31, timeSlot: "14:00-15:00", event: "Client Call" },
  { day: 31, timeSlot: "19:00-20:00", event: "Rest Time" },
];

// Ritvik - Tech professional balancing work and personal interests
const ritvikSchedule: PersonaScheduleItem[] = [
  // Day 1 - CONFLICT: 08:00-09:00 (Sama has Aerial Fitness)
  { day: 1, timeSlot: "08:00-09:00", event: "Team Standup" },
  { day: 1, timeSlot: "14:00-15:00", event: "Code Review" },
  { day: 1, timeSlot: "19:00-20:00", event: "Gaming Time" },

  // Day 2 - CONFLICT: 10:00-11:00 (Sama has Wall Pilates)
  { day: 2, timeSlot: "10:00-11:00", event: "Sprint Planning" },
  { day: 2, timeSlot: "13:00-14:00", event: "Client Meeting" },
  { day: 2, timeSlot: "17:00-18:00", event: "Evening Run" },

  // Day 3 - CONFLICT: 16:00-17:00 (Sama has Aerial Fitness)
  { day: 3, timeSlot: "09:00-10:00", event: "DevOps Sync" },
  { day: 3, timeSlot: "16:00-17:00", event: "Team Retrospective" },
  { day: 3, timeSlot: "20:00-21:00", event: "Dinner with Friends" },

  // Day 4 - CONFLICT: 18:00-19:00 (Sama has Mindful Strength Training)
  { day: 4, timeSlot: "10:00-11:00", event: "Architecture Review" },
  { day: 4, timeSlot: "14:00-15:00", event: "AI Course Study" },
  { day: 4, timeSlot: "18:00-19:00", event: "Family Dinner" },

  // Day 5 - CONFLICT: 08:00-09:00 (Sama has Calm Mind Practice)
  { day: 5, timeSlot: "08:00-09:00", event: "Morning Email" },
  { day: 5, timeSlot: "13:00-14:00", event: "Technical Discussion" },
  { day: 5, timeSlot: "19:00-20:00", event: "Gaming Session" },

  // Day 6 - CONFLICT: 10:00-11:00 (Sama has Mindful Strength Training)
  { day: 6, timeSlot: "10:00-11:00", event: "Product Planning" },
  { day: 6, timeSlot: "15:00-16:00", event: "Code Review" },
  { day: 6, timeSlot: "20:00-21:00", event: "Skill Development" },

  // Day 7 - CONFLICT: 18:00-19:00 (Sama has Yoga & Calm Mind Practice)
  { day: 7, timeSlot: "09:00-10:00", event: "Team Sync" },
  { day: 7, timeSlot: "13:00-14:00", event: "Client Call" },
  { day: 7, timeSlot: "18:00-19:00", event: "Tech Meetup" },

  // Day 8 - CONFLICT: 10:00-11:00 (Sama has Yoga & Calm Mind Practice)
  { day: 8, timeSlot: "10:00-11:00", event: "Sprint Retrospective" },
  { day: 8, timeSlot: "14:00-15:00", event: "Design Review" },
  { day: 8, timeSlot: "19:00-20:00", event: "Evening Run" },

  // Day 9 - CONFLICT: 18:00-19:00 (Sama has Aerial Fitness)
  { day: 9, timeSlot: "09:00-10:00", event: "DevOps Work" },
  { day: 9, timeSlot: "13:00-14:00", event: "Team Meeting" },
  { day: 9, timeSlot: "18:00-19:00", event: "Friends Hangout" },

  // Day 10 - CONFLICT: 08:00-09:00 (Sama has Wall Pilates)
  { day: 10, timeSlot: "08:00-09:00", event: "Standup Meeting" },
  { day: 10, timeSlot: "14:00-15:00", event: "AI Course" },
  { day: 10, timeSlot: "19:00-20:00", event: "Gaming Time" },

  // Day 11 - CONFLICT: 16:00-17:00 (Sama has Aerial Fitness)
  { day: 11, timeSlot: "10:00-11:00", event: "Code Review" },
  { day: 11, timeSlot: "16:00-17:00", event: "Client Presentation" },
  { day: 11, timeSlot: "20:00-21:00", event: "Relaxation" },

  // Day 12 - CONFLICT: 10:00-11:00 (Sama has Wall Pilates)
  { day: 12, timeSlot: "10:00-11:00", event: "Architecture Meeting" },
  { day: 12, timeSlot: "14:00-15:00", event: "Technical Review" },
  { day: 12, timeSlot: "19:00-20:00", event: "Evening Walk" },

  // Day 13 - CONFLICT: 16:00-17:00 (Sama has Reformer Pilates)
  { day: 13, timeSlot: "09:00-10:00", event: "Sprint Planning" },
  { day: 13, timeSlot: "16:00-17:00", event: "Team Sync" },
  { day: 13, timeSlot: "20:00-21:00", event: "Skill Learning" },

  // Day 14 - CONFLICT: 18:00-19:00 (Sama has Aerial Fitness)
  { day: 14, timeSlot: "10:00-11:00", event: "Product Discussion" },
  { day: 14, timeSlot: "14:00-15:00", event: "Code Review" },
  { day: 14, timeSlot: "18:00-19:00", event: "Dinner Date" },

  // Day 15 - CONFLICT: 16:00-17:00 (Sama has Wall Pilates)
  { day: 15, timeSlot: "09:00-10:00", event: "DevOps Work" },
  { day: 15, timeSlot: "16:00-17:00", event: "Client Meeting" },
  { day: 15, timeSlot: "20:00-21:00", event: "Gaming Session" },

  // Day 16 - CONFLICT: 18:00-19:00 (Sama has Calm Mind Practice)
  { day: 16, timeSlot: "10:00-11:00", event: "Team Standup" },
  { day: 16, timeSlot: "13:00-14:00", event: "Technical Discussion" },
  { day: 16, timeSlot: "18:00-19:00", event: "Family Time" },

  // Day 17 - CONFLICT: 10:00-11:00 (Sama has Wall Pilates)
  { day: 17, timeSlot: "10:00-11:00", event: "Sprint Review" },
  { day: 17, timeSlot: "15:00-16:00", event: "Code Review" },
  { day: 17, timeSlot: "19:00-20:00", event: "Evening Run" },

  // Day 18 - CONFLICT: 10:00-11:00 (Sama has Mindful Strength Training)
  { day: 18, timeSlot: "10:00-11:00", event: "Client Call" },
  { day: 18, timeSlot: "14:00-15:00", event: "Design Review" },
  { day: 18, timeSlot: "20:00-21:00", event: "Relaxation Time" },

  // Day 19 - CONFLICT: 16:00-17:00 (Sama has Calm Mind Practice)
  { day: 19, timeSlot: "09:00-10:00", event: "Team Meeting" },
  { day: 19, timeSlot: "16:00-17:00", event: "Architecture Review" },
  { day: 19, timeSlot: "19:00-20:00", event: "Gaming Time" },

  // Day 20 - CONFLICT: 10:00-11:00 (Sama has Mindful Strength Training)
  { day: 20, timeSlot: "10:00-11:00", event: "Product Planning" },
  { day: 20, timeSlot: "14:00-15:00", event: "Technical Sync" },
  { day: 20, timeSlot: "19:00-20:00", event: "Dinner with Friends" },

  // Day 21 - CONFLICT: 16:00-17:00 (Sama has Wall Pilates)
  { day: 21, timeSlot: "09:00-10:00", event: "DevOps Work" },
  { day: 21, timeSlot: "16:00-17:00", event: "Team Retrospective" },
  { day: 21, timeSlot: "20:00-21:00", event: "AI Course" },

  // Day 22 - CONFLICT: 08:00-09:00 (Sama has Reformer Pilates)
  { day: 22, timeSlot: "08:00-09:00", event: "Morning Standup" },
  { day: 22, timeSlot: "13:00-14:00", event: "Code Review" },
  { day: 22, timeSlot: "19:00-20:00", event: "Evening Walk" },

  // Day 23 - CONFLICT: 16:00-17:00 (Sama has Yoga & Calm Mind Practice)
  { day: 23, timeSlot: "10:00-11:00", event: "Sprint Planning" },
  { day: 23, timeSlot: "16:00-17:00", event: "Client Meeting" },
  { day: 23, timeSlot: "20:00-21:00", event: "Gaming Session" },

  // Day 24 - CONFLICT: 08:00-09:00 (Sama has Wall Pilates)
  { day: 24, timeSlot: "08:00-09:00", event: "Team Sync" },
  { day: 24, timeSlot: "14:00-15:00", event: "Technical Review" },
  { day: 24, timeSlot: "19:00-20:00", event: "Skill Development" },

  // Day 25 - CONFLICT: 16:00-17:00 (Sama has Mindful Strength Training)
  { day: 25, timeSlot: "09:00-10:00", event: "Product Discussion" },
  { day: 25, timeSlot: "16:00-17:00", event: "Architecture Meeting" },
  { day: 25, timeSlot: "20:00-21:00", event: "Relaxation" },

  // Day 26 - CONFLICT: 10:00-11:00 (Sama has Aerial Fitness)
  { day: 26, timeSlot: "10:00-11:00", event: "Sprint Review" },
  { day: 26, timeSlot: "14:00-15:00", event: "Code Review" },
  { day: 26, timeSlot: "19:00-20:00", event: "Dinner Date" },

  // Day 27 - CONFLICT: 18:00-19:00 (Sama has Mindful Strength Training)
  { day: 27, timeSlot: "09:00-10:00", event: "Team Meeting" },
  { day: 27, timeSlot: "13:00-14:00", event: "Client Call" },
  { day: 27, timeSlot: "18:00-19:00", event: "Family Time" },

  // Day 28 - CONFLICT: 10:00-11:00 (Sama has Aerial Fitness)
  { day: 28, timeSlot: "10:00-11:00", event: "Technical Discussion" },
  { day: 28, timeSlot: "15:00-16:00", event: "Design Review" },
  { day: 28, timeSlot: "20:00-21:00", event: "Gaming Time" },

  // Day 29 - CONFLICT: 18:00-19:00 (Sama has Yoga & Calm Mind Practice)
  { day: 29, timeSlot: "09:00-10:00", event: "DevOps Work" },
  { day: 29, timeSlot: "14:00-15:00", event: "Team Sync" },
  { day: 29, timeSlot: "18:00-19:00", event: "Tech Meetup" },

  // Day 30 - CONFLICT: 18:00-19:00 (Sama has Wall Pilates)
  { day: 30, timeSlot: "10:00-11:00", event: "Sprint Planning" },
  { day: 30, timeSlot: "14:00-15:00", event: "AI Course" },
  { day: 30, timeSlot: "18:00-19:00", event: "Friends Hangout" },

  // Day 31 - CONFLICT: 16:00-17:00 (Sama has Calm Mind Practice)
  { day: 31, timeSlot: "09:00-10:00", event: "Code Review" },
  { day: 31, timeSlot: "16:00-17:00", event: "Client Presentation" },
  { day: 31, timeSlot: "20:00-21:00", event: "Evening Run" },
];

// Gourav - Entrepreneur managing startup and personal life
const gouravSchedule: PersonaScheduleItem[] = [
  // Day 1 - CONFLICT: 16:00-17:00 (Sama has Reformer Pilates)
  { day: 1, timeSlot: "09:00-10:00", event: "Investor Meeting" },
  { day: 1, timeSlot: "16:00-17:00", event: "Product Strategy" },
  { day: 1, timeSlot: "20:00-21:00", event: "Family Dinner" },

  // Day 2 - CONFLICT: 08:00-09:00 (Sama has Aerial Fitness)
  { day: 2, timeSlot: "08:00-09:00", event: "Morning Email" },
  { day: 2, timeSlot: "13:00-14:00", event: "Client Call" },
  { day: 2, timeSlot: "17:00-18:00", event: "Evening Walk" },

  // Day 3 - CONFLICT: 10:00-11:00 (Sama has Calm Mind Practice)
  { day: 3, timeSlot: "10:00-11:00", event: "Team Sync" },
  { day: 3, timeSlot: "14:00-15:00", event: "Design Review" },
  { day: 3, timeSlot: "19:00-20:00", event: "Reading Time" },

  // Day 4 - CONFLICT: 10:00-11:00 (Sama has Yoga & Calm Mind Practice)
  { day: 4, timeSlot: "10:00-11:00", event: "Startup Pitch Work" },
  { day: 4, timeSlot: "15:00-16:00", event: "Content Creation" },
  { day: 4, timeSlot: "20:00-21:00", event: "Dinner with Partner" },

  // Day 5 - CONFLICT: 19:30-20:30 (Sama has Yoga & Calm Mind Practice)
  { day: 5, timeSlot: "09:00-10:00", event: "Strategy Meeting" },
  { day: 5, timeSlot: "14:00-15:00", event: "Investor Call" },
  { day: 5, timeSlot: "19:30-20:30", event: "Weekend Planning" },

  // Day 6 - CONFLICT: 19:30-20:30 (Sama has Reformer Pilates)
  { day: 6, timeSlot: "10:00-11:00", event: "Team Meeting" },
  { day: 6, timeSlot: "15:00-16:00", event: "Product Review" },
  { day: 6, timeSlot: "19:30-20:30", event: "Date Night" },

  // Day 7 - CONFLICT: 16:00-17:00 (Sama has Wall Pilates)
  { day: 7, timeSlot: "09:00-10:00", event: "Client Strategy" },
  { day: 7, timeSlot: "16:00-17:00", event: "Design Sprint" },
  { day: 7, timeSlot: "20:00-21:00", event: "Relaxation" },

  // Day 8 - CONFLICT: 08:00-09:00 (Sama has Aerial Fitness)
  { day: 8, timeSlot: "08:00-09:00", event: "Morning Standup" },
  { day: 8, timeSlot: "13:00-14:00", event: "Investor Meeting" },
  { day: 8, timeSlot: "19:00-20:00", event: "Evening Walk" },

  // Day 9 - CONFLICT: 16:00-17:00 (Sama has Calm Mind Practice)
  { day: 9, timeSlot: "10:00-11:00", event: "Product Planning" },
  { day: 9, timeSlot: "16:00-17:00", event: "Team Review" },
  { day: 9, timeSlot: "20:00-21:00", event: "Family Time" },

  // Day 10 - CONFLICT: 10:00-11:00 (Sama has Reformer Pilates)
  { day: 10, timeSlot: "10:00-11:00", event: "Client Presentation" },
  { day: 10, timeSlot: "14:00-15:00", event: "Strategy Session" },
  { day: 10, timeSlot: "19:00-20:00", event: "Dinner Out" },

  // Day 11 - CONFLICT: 10:00-11:00 (Sama has Wall Pilates)
  { day: 11, timeSlot: "10:00-11:00", event: "Pitch Deck Work" },
  { day: 11, timeSlot: "15:00-16:00", event: "Content Writing" },
  { day: 11, timeSlot: "20:00-21:00", event: "Relaxation" },

  // Day 12 - CONFLICT: 18:00-19:00 (Sama has Yoga & Calm Mind Practice)
  { day: 12, timeSlot: "09:00-10:00", event: "Team Sync" },
  { day: 12, timeSlot: "13:00-14:00", event: "Design Review" },
  { day: 12, timeSlot: "18:00-19:00", event: "Networking Event" },

  // Day 13 - CONFLICT: 10:00-11:00 (Sama has Mindful Strength Training)
  { day: 13, timeSlot: "10:00-11:00", event: "Investor Call" },
  { day: 13, timeSlot: "14:00-15:00", event: "Product Work" },
  { day: 13, timeSlot: "19:00-20:00", event: "Evening Walk" },

  // Day 14 - CONFLICT: 08:00-09:00 (Sama has Calm Mind Practice)
  { day: 14, timeSlot: "08:00-09:00", event: "Morning Email" },
  { day: 14, timeSlot: "13:00-14:00", event: "Team Meeting" },
  { day: 14, timeSlot: "20:00-21:00", event: "Family Dinner" },

  // Day 15 - CONFLICT: 18:00-19:00 (Sama has Yoga & Calm Mind Practice)
  { day: 15, timeSlot: "10:00-11:00", event: "Strategy Session" },
  { day: 15, timeSlot: "14:00-15:00", event: "Client Call" },
  { day: 15, timeSlot: "18:00-19:00", event: "Startup Workshop" },

  // Day 16 - CONFLICT: 10:00-11:00 (Sama has Reformer Pilates)
  { day: 16, timeSlot: "10:00-11:00", event: "Product Review" },
  { day: 16, timeSlot: "15:00-16:00", event: "Design Sprint" },
  { day: 16, timeSlot: "19:00-20:00", event: "Reading Time" },

  // Day 17 - CONFLICT: 18:00-19:00 (Sama has Mindful Strength Training)
  { day: 17, timeSlot: "09:00-10:00", event: "Team Standup" },
  { day: 17, timeSlot: "13:00-14:00", event: "Investor Meeting" },
  { day: 17, timeSlot: "18:00-19:00", event: "Business Dinner" },

  // Day 18 - CONFLICT: 08:00-09:00 (Sama has Aerial Fitness)
  { day: 18, timeSlot: "08:00-09:00", event: "Morning Planning" },
  { day: 18, timeSlot: "14:00-15:00", event: "Client Strategy" },
  { day: 18, timeSlot: "20:00-21:00", event: "Relaxation" },

  // Day 19 - CONFLICT: 10:00-11:00 (Sama has Wall Pilates)
  { day: 19, timeSlot: "10:00-11:00", event: "Sprint Planning" },
  { day: 19, timeSlot: "15:00-16:00", event: "Product Work" },
  { day: 19, timeSlot: "19:00-20:00", event: "Evening Walk" },

  // Day 20 - CONFLICT: 16:00-17:00 (Sama has Calm Mind Practice)
  { day: 20, timeSlot: "09:00-10:00", event: "Team Meeting" },
  { day: 20, timeSlot: "16:00-17:00", event: "Client Presentation" },
  { day: 20, timeSlot: "20:00-21:00", event: "Family Time" },

  // Day 21 - CONFLICT: 10:00-11:00 (Sama has Mindful Strength Training)
  { day: 21, timeSlot: "10:00-11:00", event: "Investor Pitch" },
  { day: 21, timeSlot: "14:00-15:00", event: "Design Review" },
  { day: 21, timeSlot: "19:00-20:00", event: "Dinner Date" },

  // Day 22 - CONFLICT: 19:30-20:30 (Sama has Calm Mind Practice)
  { day: 22, timeSlot: "10:00-11:00", event: "Strategy Session" },
  { day: 22, timeSlot: "15:00-16:00", event: "Content Creation" },
  { day: 22, timeSlot: "19:30-20:30", event: "Weekend Planning" },

  // Day 23 - CONFLICT: 08:00-09:00 (Sama has Aerial Fitness)
  { day: 23, timeSlot: "08:00-09:00", event: "Morning Standup" },
  { day: 23, timeSlot: "13:00-14:00", event: "Team Sync" },
  { day: 23, timeSlot: "20:00-21:00", event: "Relaxation" },

  // Day 24 - CONFLICT: 19:30-20:30 (Sama has Yoga & Calm Mind Practice)
  { day: 24, timeSlot: "09:00-10:00", event: "Product Review" },
  { day: 24, timeSlot: "14:00-15:00", event: "Client Call" },
  { day: 24, timeSlot: "19:30-20:30", event: "Networking Dinner" },

  // Day 25 - CONFLICT: 08:00-09:00 (Sama has Wall Pilates)
  { day: 25, timeSlot: "08:00-09:00", event: "Morning Email" },
  { day: 25, timeSlot: "13:00-14:00", event: "Investor Meeting" },
  { day: 25, timeSlot: "19:00-20:00", event: "Evening Walk" },

  // Day 26 - CONFLICT: 16:00-17:00 (Sama has Yoga & Calm Mind Practice)
  { day: 26, timeSlot: "10:00-11:00", event: "Team Meeting" },
  { day: 26, timeSlot: "16:00-17:00", event: "Design Sprint" },
  { day: 26, timeSlot: "20:00-21:00", event: "Family Dinner" },

  // Day 27 - CONFLICT: 16:00-17:00 (Sama has Reformer Pilates)
  { day: 27, timeSlot: "09:00-10:00", event: "Strategy Session" },
  { day: 27, timeSlot: "16:00-17:00", event: "Client Strategy" },
  { day: 27, timeSlot: "20:00-21:00", event: "Reading Time" },

  // Day 28 - CONFLICT: 19:30-20:30 (Sama has Wall Pilates)
  { day: 28, timeSlot: "10:00-11:00", event: "Product Planning" },
  { day: 28, timeSlot: "14:00-15:00", event: "Team Review" },
  { day: 28, timeSlot: "19:30-20:30", event: "Date Night" },

  // Day 29 - CONFLICT: 10:00-11:00 (Sama has Mindful Strength Training)
  { day: 29, timeSlot: "10:00-11:00", event: "Sprint Retrospective" },
  { day: 29, timeSlot: "15:00-16:00", event: "Content Writing" },
  { day: 29, timeSlot: "19:00-20:00", event: "Relaxation" },

  // Day 30 - CONFLICT: 08:00-09:00 (Sama has Yoga & Calm Mind Practice)
  { day: 30, timeSlot: "08:00-09:00", event: "Morning Planning" },
  { day: 30, timeSlot: "13:00-14:00", event: "Investor Call" },
  { day: 30, timeSlot: "20:00-21:00", event: "Family Time" },

  // Day 31 - CONFLICT: 10:00-11:00 (Sama has Aerial Fitness)
  { day: 31, timeSlot: "10:00-11:00", event: "Team Standup" },
  { day: 31, timeSlot: "14:00-15:00", event: "Client Presentation" },
  { day: 31, timeSlot: "19:00-20:00", event: "Evening Walk" },
];

export const personas: Persona[] = [
  {
    id: "sheela",
    name: "Sheela",
    description: "Pregnant woman balancing freelance work, wellness, and preparing for motherhood",
    schedule: sheelaSchedule,
  },
  {
    id: "ritvik",
    name: "Ritvik",
    description: "Tech professional balancing DevOps work, skill development, and personal wellness",
    schedule: ritvikSchedule,
  },
  {
    id: "gourav",
    name: "Gourav",
    description: "Entrepreneur managing startup growth, investor relations, and work-life balance",
    schedule: gouravSchedule,
  },
];

// Helper function to get persona by ID
export function getPersonaById(id: string): Persona | undefined {
  return personas.find((p) => p.id === id);
}

// Helper function to get all persona names
export function getPersonaNames(): Array<{ id: string; name: string }> {
  return personas.map((p) => ({ id: p.id, name: p.name }));
}

'use client';

import { Badge } from '@/components/ui/badge';

interface QuickPromptsProps {
  hasCalendarPermission: boolean;
  onPromptClick: (prompt: string) => void;
}

export default function QuickPrompts({ hasCalendarPermission, onPromptClick }: QuickPromptsProps) {
  // Combined array of all prompts
  const allPrompts = [
    // Wellness prompts
    "How can I stay calm today?",
    "Help me plan a mindful day",
    "Suggest a wellness break",
    "What are some stress relief techniques?",
    "Help me with meditation guidance",
    "How can I improve my sleep?",

    // Calendar prompts (only show if calendar is connected)
    ...(hasCalendarPermission ? [
      "What's my schedule like today?",
      "What meetings do I have today?",
      "How busy is my schedule this week?",
      "Suggest breaks between my meetings",
      "Help me plan around my calendar",
      "What's coming up this week?"
    ] : [])
  ];

  return (
    <div className="p-4 border-b border-border">
      <p className="text-sm text-muted-foreground mb-3 font-medium">Quick start:</p>
      <div className="flex flex-wrap gap-2">
        {allPrompts.map((prompt, index) => (
          <Badge
            key={index}
            variant="secondary"
            onClick={() => onPromptClick(prompt)}
            className="px-3 py-1 rounded-full text-xs cursor-pointer hover:bg-accent transition-colors font-medium"
          >
            {prompt}
          </Badge>
        ))}
      </div>
    </div>
  );
}

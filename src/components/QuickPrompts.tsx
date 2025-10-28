'use client';

import { Suggestions, Suggestion } from '@/components/ai-elements/suggestion';

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
    <div className="border-t border-border bg-background/50">
      <div className="px-4 pt-3">
        <p className="text-sm text-muted-foreground mb-2 font-medium">Quick start:</p>
      </div>
      <Suggestions className="px-4 pb-3">
        {allPrompts.map((prompt, index) => (
          <Suggestion key={index} suggestion={prompt} onClick={onPromptClick} />
        ))}
      </Suggestions>
    </div>
  );
}

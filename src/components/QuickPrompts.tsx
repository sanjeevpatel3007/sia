'use client';

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
    "What meetings do I have today?",
    "How busy is my schedule this week?",
    "Suggest breaks between my meetings",
    "Help me plan around my calendar",
    "What are some stress relief techniques?",
    "Help me with meditation guidance",
    "How can I improve my sleep?",
    "What meetings do I have today?",
    
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
    <div className="p-4 border-b border-gray-100">
      <p className="text-sm sama-text-secondary mb-3 font-medium">Quick start:</p>
      <div className="flex flex-wrap gap-2">
        {allPrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(prompt)}
            className="px-3 py-1 sama-bg-accent sama-text-primary rounded-full text-xs hover:sama-bg-accent-light transition-colors font-medium"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

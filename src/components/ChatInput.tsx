'use client';

import { Calendar, Send } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSendMessage: () => void;
  isStreaming: boolean;
  hasCalendarPermission: boolean;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRequestCalendarPermission?: () => void;
}

export default function ChatInput({
  input,
  setInput,
  onSendMessage,
  isStreaming,
  hasCalendarPermission,
  onKeyDown,
  onRequestCalendarPermission
}: ChatInputProps) {
  return (
    <div className="bg-background border-t border-border shadow-lg px-0 md:px-10">
      <div className="px-4 py-3 sm:py-4">
        <div className="flex gap-2 sm:gap-3">
          {/* Calendar status indicator */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={hasCalendarPermission ? "secondary" : "outline"}
                size="icon"
                onClick={hasCalendarPermission ? undefined : onRequestCalendarPermission}
                disabled={isStreaming}
                className="shrink-0"
              >
                <Calendar className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {hasCalendarPermission
                ? "Calendar Connected - Ask about your schedule!"
                : "Connect Google Calendar to get personalized wellness guidance based on your schedule"
              }
            </TooltipContent>
          </Tooltip>

          {/* Input field */}
          <Input
            type="text"
            className="flex-1 rounded-full text-sm sm:text-base"
            placeholder="Type your message to SIA..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={isStreaming}
          />

          {/* Send button */}
          <Button
            variant="secondary"
            size="lg"
            onClick={onSendMessage}
            disabled={isStreaming || !input.trim()}
            className="rounded-full shrink-0"
          >
            <Send size={16} />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

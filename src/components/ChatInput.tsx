'use client';

import { Calendar, Send } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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
    <div className="bg-white border-t border-gray-100 shadow-lg px-0 md:px-10">
      <div className="px-4 py-3 sm:py-4">
        <div className="flex gap-2 sm:gap-3">
          {/* Calendar status indicator */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="p-2 rounded-lg sama-bg-accent hover:sama-bg-accent-light transition-colors shrink-0" 
                onClick={hasCalendarPermission ? undefined : onRequestCalendarPermission}
                disabled={isStreaming}
              >
                {hasCalendarPermission ? (
                  <Calendar className="w-5 h-5 sama-text-primary" />
                ) : (
                  <Calendar className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {hasCalendarPermission 
                ? "Calendar Connected - Ask about your schedule!" 
                : "Click to connect your Google Calendar"
              }
            </TooltipContent>
          </Tooltip>
          
          {/* Input field */}
          <input
            type="text"
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6683AB] focus:border-transparent transition-all duration-200 text-sm sm:text-base sama-text-secondary placeholder-gray-400"
            placeholder="Type your message to SIA..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={isStreaming}
          />
          
          {/* Send button */}
          <button
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-white font-medium transition-all duration-200 text-sm sm:text-base flex items-center gap-2 shrink-0 ${
              isStreaming 
                ? "bg-gray-400 cursor-not-allowed" 
                : "sama-button-primary"
            }`}
            onClick={onSendMessage}
            disabled={isStreaming || !input.trim()}
          >
            <Send size={16} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Calendar } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTools,
  PromptInputButton,
} from "@/components/ai-elements/prompt-input";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSendMessage: () => void;
  isStreaming: boolean;
  hasCalendarPermission: boolean;
  onRequestCalendarPermission?: () => void;
}

export default function ChatInput({
  input,
  setInput,
  onSendMessage,
  isStreaming,
  hasCalendarPermission,
  onRequestCalendarPermission,
}: ChatInputProps) {
  const handleSubmit = (message: { text?: string }) => {
    if (message.text && message.text.trim()) {
      onSendMessage();
    }
  };

  return (
    <div className="absolute bottom-0 w-full left-0 z-50 pb-2">
      <PromptInput
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-background overflow-hidden rounded-2xl border border-border shadow-lg"
      >
        <PromptInputTextarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message to SIA..."
          disabled={isStreaming}
          className="resize-none"
        />
        <PromptInputFooter>
          <PromptInputTools>
            {/* Calendar status indicator */}
            <Tooltip>
              <TooltipTrigger asChild>
                <PromptInputButton
                  variant={hasCalendarPermission ? "secondary" : "ghost"}
                  onClick={
                    hasCalendarPermission
                      ? undefined
                      : onRequestCalendarPermission
                  }
                  disabled={isStreaming}
                >
                  <Calendar className="w-4 h-4" />
                </PromptInputButton>
              </TooltipTrigger>
              <TooltipContent>
                {hasCalendarPermission
                  ? "Calendar Connected - Ask about your schedule!"
                  : "Connect Google Calendar to get personalized wellness guidance"}
              </TooltipContent>
            </Tooltip>
          </PromptInputTools>

          <PromptInputSubmit
            disabled={isStreaming || !input.trim()}
            status={isStreaming ? "streaming" : undefined}
          />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}

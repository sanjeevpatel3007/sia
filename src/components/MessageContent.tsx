'use client';

import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Response } from '@/components/ai-elements/response';
import { useMemo } from 'react';

interface MessageContentProps {
  content: string;
  hasCalendarPermission: boolean;
  onRequestCalendarPermission?: () => void;
}

export default function MessageContent({
  content,
  hasCalendarPermission,
  onRequestCalendarPermission
}: MessageContentProps) {
  // Process content to replace calendar button markers with actual buttons
  const processedContent = useMemo(() => {
    // Check if content has calendar button markers
    if (content.includes('[CALENDAR_BUTTON]') || content.includes('[CONNECT_CALENDAR]')) {
      // Split the content and create a structured representation
      const parts = content.split(/(\[CALENDAR_BUTTON\]|\[CONNECT_CALENDAR\])/);

      return parts.map((part, index) => {
        if (part === '[CALENDAR_BUTTON]' || part === '[CONNECT_CALENDAR]') {
          return (
            <div key={`calendar-${index}`} className="my-3 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={onRequestCalendarPermission}
              >
                <Calendar className="w-4 h-4" />
                {part === '[CONNECT_CALENDAR]' ? 'Grant Calendar Access' : 'Connect Calendar'}
              </Button>
            </div>
          );
        }

        // Return markdown content for Response component to render
        return part ? (
          <Response key={`content-${index}`}>
            {part}
          </Response>
        ) : null;
      });
    }

    // If no calendar buttons, just render with Response component
    return <Response>{content}</Response>;
  }, [content, onRequestCalendarPermission]);

  return <div className="w-full">{processedContent}</div>;
}

'use client';

import { Response } from '@/components/ai-elements/response';
import { useMemo } from 'react';

interface MessageContentProps {
  content: string;
  hasCalendarPermission?: boolean;
  onRequestCalendarPermission?: () => void;
}

export default function MessageContent({
  content,
}: MessageContentProps) {
  // Process content - remove calendar button markers since we use dummy calendar
  const processedContent = useMemo(() => {
    // Remove any calendar button markers from content
    const cleanedContent = content
      .replace(/\[CALENDAR_BUTTON\]/g, '')
      .replace(/\[CONNECT_CALENDAR\]/g, '');

    // Render with Response component
    return <Response>{cleanedContent}</Response>;
  }, [content]);

  return <div className="w-full">{processedContent}</div>;
}

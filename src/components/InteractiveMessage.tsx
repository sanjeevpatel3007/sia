'use client';

import { useState, useEffect } from 'react';

interface InteractiveMessageProps {
  content: string;
  hasCalendarPermission?: boolean;
  onRequestCalendarPermission?: () => void;
}

export default function InteractiveMessage({
  content,
}: InteractiveMessageProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsClient(true), 0);
    return () => clearTimeout(timeoutId);
  }, []);

  if (!isClient) {
    return <div className="whitespace-pre-wrap leading-relaxed">{content}</div>;
  }

  // Function to render content with interactive components
  const renderContent = (text: string) => {
    // Remove calendar button markers since we use dummy calendar
    const cleanedText = text
      .replace(/\[CALENDAR_BUTTON\]/g, '')
      .replace(/\[CONNECT_CALENDAR\]/g, '');

    // Split content by code block markers
    const parts = cleanedText.split(/(```[\s\S]*?```)/);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // Code block rendering
        const codeContent = part.slice(3, -3).trim();
        const lines = codeContent.split('\n');
        const firstLine = lines[0];
        
        const language = firstLine.match(/^(\w+)/)?.[1] || '';
        const isLanguageBlock = /^[a-zA-Z]+$/.test(firstLine) && lines.length > 1;
        
        if (isLanguageBlock) {
          const actualCode = lines.slice(1).join('\n');
          return (
            <div key={index} className="my-4">
              <div className="bg-muted border border-border p-3 rounded-t-lg text-sm font-mono">
                {language}
              </div>
              <pre className="bg-muted/50 border border-border border-t-0 p-4 rounded-b-lg overflow-x-auto">
                <code>{actualCode}</code>
              </pre>
            </div>
          );
        } else {
          return (
            <pre key={index} className="bg-muted p-4 rounded-lg overflow-x-auto my-4 border border-border">
              <code className="text-sm">{codeContent}</code>
            </pre>
          );
        }
      } else {
        // Regular text with basic HTML support
        return (
          <div 
            key={index} 
            className="whitespace-pre-wrap leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: part
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
                .replace(/\n/g, '<br>')
            }}
          />
        );
      }
    });
  };

  return <div>{renderContent(content)}</div>;
}

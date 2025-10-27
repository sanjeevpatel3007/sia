'use client';

import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

interface InteractiveMessageProps {
  content: string;
  hasCalendarPermission: boolean;
  onRequestCalendarPermission?: () => void;
}

export default function InteractiveMessage({ 
  content, 
  hasCalendarPermission, 
  onRequestCalendarPermission 
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
    // Split content by interactive component markers
    const parts = text.split(/(\[CALENDAR_BUTTON\]|\[CONNECT_CALENDAR\]|```[\s\S]*?```)/);
    
    return parts.map((part, index) => {
      if (part === '[CALENDAR_BUTTON]') {
        // Render calendar button component
        return (
          <div key={index} className="my-3">
            <button 
              onClick={onRequestCalendarPermission}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Calendar className="w-4 h-4" />
              Connect Calendar
            </button>
          </div>
        );
      } else if (part === '[CONNECT_CALENDAR]') {
        // Alternative calendar connection button
        return (
          <div key={index} className="my-3">
            <button 
              onClick={onRequestCalendarPermission}
              className="sama-button-primary px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Calendar className="w-4 h-4" />
              Grant Calendar Access
            </button>
          </div>
        );
      } else if (part.startsWith('```') && part.endsWith('```')) {
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
              <div className="bg-gray-800 text-gray-100 p-3 rounded-t-lg text-sm font-mono">
                {language}
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto">
                <code>{actualCode}</code>
              </pre>
            </div>
          );
        } else {
          return (
            <pre key={index} className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4">
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
                .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
                .replace(/\n/g, '<br>')
            }}
          />
        );
      }
    });
  };

  return <div>{renderContent(content)}</div>;
}

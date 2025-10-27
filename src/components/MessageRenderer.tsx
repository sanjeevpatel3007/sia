'use client';

import { useState, useEffect } from 'react';

interface MessageRendererProps {
  content: string;
}

export default function MessageRenderer({ content }: MessageRendererProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsClient(true), 0);
    return () => clearTimeout(timeoutId);
  }, []);

  if (!isClient) {
    return <div className="whitespace-pre-wrap leading-relaxed">{content}</div>;
  }

  // Function to render content with HTML support
  const renderContent = (text: string) => {
    // Split content by code blocks
    const parts = text.split(/(```[\s\S]*?```)/);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // This is a code block
        const codeContent = part.slice(3, -3).trim();
        const lines = codeContent.split('\n');
        const firstLine = lines[0];
        
        // Check if it's a language-specific code block
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
          // Regular code block
          return (
            <pre key={index} className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4">
              <code className="text-sm">{codeContent}</code>
            </pre>
          );
        }
      } else {
        // Regular text - process for basic HTML
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

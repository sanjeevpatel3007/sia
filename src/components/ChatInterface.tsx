'use client';

import { useState, useRef, useEffect, useMemo } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import ChatInput from './ChatInput';
import QuickPrompts from './QuickPrompts';
import Sidebar from './sidebar';

interface ChatInterfaceProps {
  chatId?: string;
}

export default function ChatInterface({ chatId }: ChatInterfaceProps) {
  const { hasCalendarPermission, session } = useAuth();
  const { 
    currentSessionId, 
    currentMessages, 
    isMessagesLoading,
    addMessageToCurrentSession,
    switchToSession,
    createNewSession,
    setCurrentSessionId,
    setCurrentMessages
  } = useChat();
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("SIA is thinking...");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Switch to the correct session when chatId changes
  useEffect(() => {
    if (chatId && chatId !== currentSessionId) {
      switchToSession(chatId);
    } else if (!chatId && currentSessionId) {
      // If we're on /chat route (no chatId) but have a current session, clear it
      setCurrentSessionId(null);
      setCurrentMessages([]);
    }
  }, [chatId, currentSessionId, switchToSession, setCurrentSessionId, setCurrentMessages]);

 
  // Get messages to display (current messages or welcome message)
  const messagesToDisplay = useMemo(() => {
    // If we have messages, show them
    if (currentMessages.length > 0) {
      return currentMessages.map(msg => ({ role: msg.role, content: msg.content }));
    }
    
   // Show welcome message for new/empty sessions
const welcomeMessage = hasCalendarPermission 
? "Namaste! I’m SIA. I help your wellness and balance using your calendar."
: "Namaste! I’m SIA. I help your wellness and daily balance.";

    return [{ role: "assistant" as const, content: welcomeMessage }];
  }, [currentMessages, hasCalendarPermission]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesToDisplay]);

  const sendMessage = async () => {
    if (!input.trim() || !session?.user?.id) return;

    const userMessage = { role: "user" as const, content: input };
    const userInput = input;
    setInput("");
    
    // If no current session, create one first
    if (!currentSessionId) {
      const newSessionId = await createNewSession();
      // Update URL to include the new session ID
      window.history.pushState(null, '', `/chat/${newSessionId}`);
    }
    
    // Add user message to database immediately
    await addMessageToCurrentSession("user", userInput);
    
    // Set loading states immediately
    setIsStreaming(true);

    // Check if the message is calendar-related to show appropriate loading state
    const calendarKeywords = ['meeting', 'calendar', 'schedule', 'appointment', 'event', 'today', 'tomorrow', 'this week', 'upcoming', 'meet', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'next', 'available', 'busy', 'free'];
    const isCalendarRelated = calendarKeywords.some(keyword => 
      userInput.toLowerCase().includes(keyword)
    );
    
    // Set appropriate loading message based on request type
    if (isCalendarRelated && hasCalendarPermission) {
      if (userInput.toLowerCase().includes('meeting') || userInput.toLowerCase().includes('appointment')) {
        setLoadingMessage("SIA checking your meetings...");
      } else if (userInput.toLowerCase().includes('schedule') || userInput.toLowerCase().includes('today') || userInput.toLowerCase().includes('tomorrow')) {
        setLoadingMessage("SIA reviewing your schedule...");
      } else {
        setLoadingMessage("SIA checking your calendar...");
      }
    } else if (userInput.toLowerCase().includes('wellness') || userInput.toLowerCase().includes('mindful') || userInput.toLowerCase().includes('stress') || userInput.toLowerCase().includes('meditation')) {
      setLoadingMessage("SIA preparing wellness guidance...");
    } else if (userInput.toLowerCase().includes('plan') || userInput.toLowerCase().includes('organize')) {
      setLoadingMessage("SIA analyzing your request...");
    } else if (userInput.toLowerCase().includes('help') || userInput.toLowerCase().includes('how')) {
      setLoadingMessage("SIA gathering information...");
    } else {
      setLoadingMessage("SIA is thinking...");
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messagesToDisplay, userMessage],
          session: session,
          sessionId: currentSessionId
        }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value);
      }

      // Add assistant response to database
      await addMessageToCurrentSession("assistant", assistantText);

    } catch (err) {
      console.error("Chat error:", err);
      await addMessageToCurrentSession("assistant", "Sorry, something went wrong. Please try again.");
    } finally {
      setIsStreaming(false);
      setLoadingMessage("SIA is thinking..."); // Reset to default
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const testCalendarAccess = async () => {
    try {
      const response = await fetch('/api/test-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session })
      });
      
      const result = await response.json();
      console.log('Calendar test result:', result);
      
      if (result.success) {
        setInput('What meetings do I have today?');
      } else {
        alert(`Calendar test failed: ${result.message}\n\nError: ${result.error}\n\nSession data: ${JSON.stringify(result.sessionData, null, 2)}\n\nDetails: ${JSON.stringify(result.details, null, 2)}`);
      }
    } catch (error) {
      console.error('Calendar test error:', error);
      alert('Calendar test failed: ' + error);
    }
  };

  const debugScopes = async () => {
    try {
      const response = await fetch('/api/debug-scopes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session })
      });
      
      const result = await response.json();
      console.log('Scope debug result:', result);
      
      if (result.success) {
        alert(`Scopes Debug:\n\nScopes: ${result.scopes?.join(', ') || 'None'}\n\nToken Info: ${JSON.stringify(result.tokenInfo, null, 2)}`);
      } else {
        alert(`Scope debug failed: ${result.error}\n\nDetails: ${JSON.stringify(result.details, null, 2)}`);
      }
    } catch (error) {
      console.error('Scope debug error:', error);
      alert('Scope debug failed: ' + error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Calendar Status */}
          {hasCalendarPermission && (
            <div className="sama-bg-accent border-b border-gray-100 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 sama-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="sama-text-primary text-sm font-medium">Calendar Connected - Ask about your schedule!</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={testCalendarAccess}
                  className="px-2 py-1 sama-button-primary text-xs"
                >
                  Test Access
                </button>
                <button
                  onClick={debugScopes}
                  className="px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white text-xs rounded-lg transition-colors"
                >
                  Debug Scopes
                </button>
              </div>
            </div>
          )}

          {/* Quick Prompts */}
          {messagesToDisplay.length <= 1 && (
            <QuickPrompts 
              hasCalendarPermission={hasCalendarPermission}
              onPromptClick={handleQuickPrompt}
            />
          )}

          {/* Messages Container */}
        {/* Messages Container */}
{/* Messages Container */}
<div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
  {isMessagesLoading && currentSessionId ? (
    <div className="flex justify-center items-center h-32">
      <div className="flex items-center space-x-2 text-[hsl(216,30%,53%)]">
        <div className="w-4 h-4 border-2 border-[hsl(216,30%,53%)] border-t-transparent rounded-full animate-spin"></div>
        <span>Loading chat history...</span>
      </div>
    </div>
  ) : (
    messagesToDisplay.map((msg, idx) => (
      <div
        key={idx}
        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`inline-flex max-w-[90%] p-3 sm:p-4 rounded-2xl shadow-sm break-words ${
            msg.role === "user"
              ? "bg-[hsl(218,28%,53%)] text-white"
              : msg.role === "assistant"
              ? "bg-[hsl(47,71%,90%)] text-[hsl(218,28%,53%)]"
              : "bg-yellow-50 text-yellow-800 text-center text-sm italic"
          }`}
        >
          <div className="whitespace-pre-wrap leading-relaxed">
            {msg.content}
          </div>
        </div>
      </div>
    ))
  )}

  {isStreaming && (
    <div className="flex justify-start">
      <div className="inline-flex max-w-[90%] bg-[hsl(47,71%,90%)] text-[hsl(218,28%,53%)] p-4 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-[hsl(32,100%,97%)] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[hsl(32,100%,97%)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-[hsl(32,100%,97%)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-sm">
            {loadingMessage}
          </span>
        </div>
      </div>
    </div>
  )}

  <div ref={messagesEndRef} />
</div>



          {/* Chat Input Component */}
          <ChatInput
            input={input}
            setInput={setInput}
            onSendMessage={sendMessage}
            isStreaming={isStreaming}
            hasCalendarPermission={hasCalendarPermission}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
}

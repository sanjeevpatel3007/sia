'use client';

import { useState, useRef, useEffect } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import ChatInput from './ChatInput';
import QuickPrompts from './QuickPrompts';
import Sidebar from './sidebar';
import LoadingSteps from './LoadingSteps';
import InteractiveMessage from './InteractiveMessage';

interface ChatInterfaceProps {
  chatId?: string;
}

export default function ChatInterface({ chatId }: ChatInterfaceProps) {
  const { hasCalendarPermission, session, requestCalendarPermission } = useAuth();
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
  const [localMessages, setLocalMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [questionType, setQuestionType] = useState<'calendar' | 'wellness' | 'general' | 'planning'>('general');
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

  // Load messages from database when session changes
  useEffect(() => {
    if (currentMessages.length > 0) {
      setLocalMessages(currentMessages.map(msg => ({ role: msg.role, content: msg.content })));
    } else {
      // Show welcome message for new/empty sessions
      const welcomeMessage = hasCalendarPermission 
        ? "Namaste! I'm SIA. I help your wellness and balance using your calendar."
        : "Namaste! I'm SIA. I help your wellness and daily balance.";
      
      setLocalMessages([{ role: "assistant" as const, content: welcomeMessage }]);
    }
  }, [currentMessages, hasCalendarPermission]);

  // Get messages to display (use local state for immediate updates)
  const messagesToDisplay = localMessages;

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesToDisplay]);

  const sendMessage = async () => {
    if (!input.trim() || !session?.user?.id) return;

    const userMessage = { role: "user" as const, content: input };
    const userInput = input;
    setInput("");
    
    // Determine question type for loading steps
    const calendarKeywords = ['meeting', 'calendar', 'schedule', 'appointment', 'event', 'today', 'tomorrow', 'this week', 'upcoming', 'meet', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'next', 'available', 'busy', 'free'];
    const wellnessKeywords = ['wellness', 'mindful', 'stress', 'meditation', 'breathing', 'relax', 'calm', 'anxiety', 'mental health', 'self-care'];
    const planningKeywords = ['plan', 'organize', 'structure', 'arrange', 'prepare', 'schedule'];
    
    let detectedType: 'calendar' | 'wellness' | 'general' | 'planning' = 'general';
    
    if (calendarKeywords.some(keyword => userInput.toLowerCase().includes(keyword)) && hasCalendarPermission) {
      detectedType = 'calendar';
    } else if (wellnessKeywords.some(keyword => userInput.toLowerCase().includes(keyword))) {
      detectedType = 'wellness';
    } else if (planningKeywords.some(keyword => userInput.toLowerCase().includes(keyword))) {
      detectedType = 'planning';
    }
    
    setQuestionType(detectedType);
    
    // Add user message to local state immediately for instant display
    setLocalMessages(prev => [...prev, userMessage]);
    
    let sessionIdToUse: string;
    
    // If no current session, create one first
    if (!currentSessionId) {
      sessionIdToUse = await createNewSession();
      // Update URL to include the new session ID (but don't refresh the page)
      window.history.pushState(null, '', `/chat/${sessionIdToUse}`);
    } else {
      sessionIdToUse = currentSessionId;
    }
    
    // Add user message to database in background
    addMessageToCurrentSession("user", userInput, sessionIdToUse).catch(console.error);
    
    // Set loading states immediately
    setIsStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messagesToDisplay, userMessage],
          session: session,
          sessionId: sessionIdToUse
        }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      // Add empty assistant message to local state for streaming
      const assistantMessage = { role: "assistant" as const, content: "" };
      setLocalMessages(prev => [...prev, assistantMessage]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value);
        
        // Update the assistant message in local state for real-time display
        setLocalMessages(prev => 
          prev.map((msg, index) => 
            index === prev.length - 1 && msg.role === "assistant" 
              ? { ...msg, content: assistantText }
              : msg
          )
        );
      }

      // Add assistant response to database in background
      addMessageToCurrentSession("assistant", assistantText, sessionIdToUse).catch(console.error);

    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage = "Sorry, something went wrong. Please try again.";
      
      // Add error message to local state
      setLocalMessages(prev => [...prev, { role: "assistant", content: errorMessage }]);
      
      // Add error message to database in background
      addMessageToCurrentSession("assistant", errorMessage, sessionIdToUse).catch(console.error);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
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
              {/* <div className="flex gap-2">
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
              </div> */}
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
          className={`inline-flex max-w-[90%] p-3 sm:p-4 rounded-2xl shadow-sm wrap-break-word ${
            msg.role === "user"
              ? "bg-[hsl(218,28%,53%)] text-white"
              : msg.role === "assistant"
              ? "bg-[hsl(47,71%,90%)] text-[hsl(218,28%,53%)]"
              : "bg-yellow-50 text-yellow-800 text-center text-sm italic"
          }`}
        >
          <InteractiveMessage 
            content={msg.content} 
            hasCalendarPermission={hasCalendarPermission}
            onRequestCalendarPermission={requestCalendarPermission}
          />
        </div>
      </div>
    ))
  )}

  <LoadingSteps questionType={questionType} isActive={isStreaming} />

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
            onRequestCalendarPermission={requestCalendarPermission}
          />
        </div>
      </div>
    </div>
  );
}

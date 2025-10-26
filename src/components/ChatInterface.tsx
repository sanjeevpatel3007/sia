'use client';

import { useState, useRef, useEffect } from "react";
import { useAuth } from '@/contexts/AuthContext';

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export default function ChatInterface() {
  const { hasCalendarPermission, session } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  // Add welcome message on component mount
  useEffect(() => {
    const welcomeMessage = hasCalendarPermission 
      ? "Hello! I'm SIA, your wellness companion. I can help you with mindfulness, stress relief, and even check your calendar to help you plan a balanced day. How are you feeling today?"
      : "Hello! I'm SIA, your wellness companion. I'm here to help you with mindfulness, stress relief, and finding balance in your day. How are you feeling today?";
    
    setMessages([
      {
        role: "assistant",
        content: welcomeMessage,
      },
    ]);
  }, [hasCalendarPermission]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isFetchingCalendar, setIsFetchingCalendar] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("SIA is thinking...");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    // Set loading states immediately
    setIsStreaming(true);

    // Check if the message is calendar-related to show appropriate loading state
    const calendarKeywords = ['meeting', 'calendar', 'schedule', 'appointment', 'event', 'today', 'tomorrow', 'this week', 'upcoming', 'meet', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'next', 'available', 'busy', 'free'];
    const isCalendarRelated = calendarKeywords.some(keyword => 
      input.toLowerCase().includes(keyword)
    );
    
    // Set appropriate loading message based on request type
    if (isCalendarRelated && hasCalendarPermission) {
      setIsFetchingCalendar(true);
      if (input.toLowerCase().includes('meeting') || input.toLowerCase().includes('appointment')) {
        setLoadingMessage("SIA checking your meetings...");
      } else if (input.toLowerCase().includes('schedule') || input.toLowerCase().includes('today') || input.toLowerCase().includes('tomorrow')) {
        setLoadingMessage("SIA reviewing your schedule...");
      } else {
        setLoadingMessage("SIA checking your calendar...");
      }
    } else if (input.toLowerCase().includes('wellness') || input.toLowerCase().includes('mindful') || input.toLowerCase().includes('stress') || input.toLowerCase().includes('meditation')) {
      setLoadingMessage("SIA preparing wellness guidance...");
    } else if (input.toLowerCase().includes('plan') || input.toLowerCase().includes('organize')) {
      setLoadingMessage("SIA analyzing your request...");
    } else if (input.toLowerCase().includes('help') || input.toLowerCase().includes('how')) {
      setLoadingMessage("SIA gathering information...");
    } else {
      setLoadingMessage("SIA is thinking...");
    }

    try {
      // Add empty assistant message first to show typing indicator
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          session: session
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
        setMessages((prev) => {
          // Update the last message (which should be the assistant message we just added)
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: assistantText };
          return updated;
        });
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: "Sorry, something went wrong. Please try again." };
        return updated;
      });
    } finally {
      setIsStreaming(false);
      setIsFetchingCalendar(false);
      setLoadingMessage("SIA is thinking..."); // Reset to default
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  const quickPrompts = [
    "How can I stay calm today?",
    "What's my schedule like today?",
    "Help me plan a mindful day",
    "Suggest a wellness break"
  ];

  const calendarPrompts = [
    "What meetings do I have today?",
    "How busy is my schedule this week?",
    "Suggest breaks between my meetings",
    "Help me plan around my calendar"
  ];

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
    <div className="flex flex-col h-[400px] sm:h-[500px] max-w-4xl mx-auto bg-white rounded-xl shadow-xl border border-gray-200">
      {/* Calendar Status */}
      {hasCalendarPermission && (
        <div className="bg-green-50 border-b border-green-200 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-green-700 text-sm font-medium">Calendar Connected - Ask about your schedule!</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={testCalendarAccess}
              className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
            >
              Test Access
            </button>
            <button
              onClick={debugScopes}
              className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
            >
              Debug Scopes
            </button>
          </div>
        </div>
      )}

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="p-4 border-b border-gray-200">
          <p className="text-sm text-gray-600 mb-3">Quick start:</p>
          <div className="flex flex-wrap gap-2">
            {(hasCalendarPermission ? calendarPrompts : quickPrompts).map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleQuickPrompt(prompt)}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs hover:bg-blue-100 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-2xl ${
                msg.role === "user"
                  ? "bg-blue-500 text-white rounded-br-md"
                  : msg.role === "assistant"
                  ? "bg-gray-100 text-gray-800 rounded-bl-md"
                  : "bg-yellow-50 text-yellow-800 text-center text-sm italic"
              }`}
            >
              <div className="whitespace-pre-wrap wrap-break-word">
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isStreaming && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 p-4 rounded-2xl rounded-bl-md max-w-[80%]">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-600">
                  {loadingMessage}
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div className="border-t border-gray-200 p-3 sm:p-4">
        <div className="flex gap-2 sm:gap-3">
           {/* calender connected */}
          <button>
          c
          {/* alender connected : calender not connected */}
          </button>
          <input
            type="text"
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
            placeholder="Type your message to SIA..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
          />
          <button
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-white font-medium transition-all duration-200 text-sm sm:text-base ${
              isStreaming 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-500 hover:bg-blue-600 hover:shadow-lg active:scale-95"
            }`}
            onClick={sendMessage}
            disabled={isStreaming || !input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useChat as useVercelChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useAuth } from "@/contexts/AuthContext";
import { useChat as useChatContext } from "@/contexts/ChatContext";
import ChatInput from "./ChatInput";
import QuickPrompts from "./QuickPrompts";
import Sidebar from "./sidebar";
import LoadingSteps from "./LoadingSteps";
import MessageContent from "./MessageContent";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";

interface ChatInterfaceProps {
  chatId?: string;
}

export default function ChatInterface({ chatId }: ChatInterfaceProps) {
  const { hasCalendarPermission, session, requestCalendarPermission } =
    useAuth();
  const {
    currentSessionId,
    currentMessages,
    isMessagesLoading,
    switchToSession,
    setCurrentSessionId,
    setCurrentMessages,
    refreshSessions,
  } = useChatContext();

  const [input, setInput] = useState("");
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);

  // Initialize Vercel AI SDK's useChat hook
  const {
    messages,
    sendMessage: sendVercelMessage,
    status,
    setMessages,
  } = useVercelChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onFinish: async () => {
      // Refresh sessions to update sidebar
      await refreshSessions();
      console.log("Chat response finished and sessions refreshed");
    },
  });

  // Switch to the correct session when chatId changes
  useEffect(() => {
    if (chatId && chatId !== currentSessionId) {
      switchToSession(chatId);
      setHasLoadedHistory(false); // Reset flag when switching sessions
    } else if (!chatId && currentSessionId) {
      // If we're on /chat route (no chatId) but have a current session, clear it
      setCurrentSessionId(null);
      setCurrentMessages([]);
      setMessages([]); // Clear AI SDK messages too
      setHasLoadedHistory(false);
    }
  }, [
    chatId,
    currentSessionId,
    switchToSession,
    setCurrentSessionId,
    setCurrentMessages,
    setMessages,
  ]);

  // Load messages from database ONLY when switching sessions or on initial load
  // Don't reload during active chat to prevent overwriting optimistic updates
  useEffect(() => {
    // Skip if already loaded or currently loading

    if (currentSessionId) {
      // Loading an existing session with history
      if (currentMessages.length > 0) {
        // Convert database messages to AI SDK format
        const aiMessages = currentMessages.map((msg) => ({
          id: msg.id || `${msg.role}-${Date.now()}`,
          role: msg.role,
          parts: [{ type: "text" as const, text: msg.content }],
        }));
        console.log({ aiMessages });
        setMessages(aiMessages);
        setHasLoadedHistory(true);
      } else if (!isMessagesLoading) {
        // Session exists but no messages yet - show welcome
        const welcomeMessage = hasCalendarPermission
          ? "Namaste! I'm SIA. I help your wellness and balance using your calendar."
          : "Namaste! I'm SIA. I help your wellness and daily balance.";

        setMessages([
          {
            id: "welcome",
            role: "assistant" as const,
            parts: [{ type: "text" as const, text: welcomeMessage }],
          },
        ]);
        setHasLoadedHistory(true);
      }
    } else {
      // No session - show welcome message for new chat
      const welcomeMessage = hasCalendarPermission
        ? "Namaste! I'm SIA. I help your wellness and balance using your calendar."
        : "Namaste! I'm SIA. I help your wellness and daily balance.";

      setMessages([
        {
          id: "welcome",
          role: "assistant" as const,
          parts: [{ type: "text" as const, text: welcomeMessage }],
        },
      ]);
      setHasLoadedHistory(true);
    }
  }, [
    currentSessionId,
    currentMessages,
    hasCalendarPermission,
    setMessages,
    hasLoadedHistory,
    isMessagesLoading,
  ]);

  const sendMessage = async () => {
    if (!input.trim() || !session?.user?.id) return;

    const userInput = input;
    setInput("");

    // Use chatId (from URL) as the session ID
    // Backend will create session if it doesn't exist yet
    const sessionIdToUse = chatId || currentSessionId;

    // If this is a new chat, mark history as loaded to prevent DB overwrites
    if (!currentSessionId && chatId) {
      setHasLoadedHistory(true);
    }

    // Use Vercel AI SDK's sendMessage with custom body data
    await sendVercelMessage(
      { text: userInput },
      {
        body: {
          session: session,
          sessionId: sessionIdToUse,
        },
      }
    );
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
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Calendar Status */}
          {hasCalendarPermission && (
            <div className="bg-accent border-b border-border p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-accent-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-accent-foreground text-sm font-medium">
                  Calendar Connected - Ask about your schedule!
                </span>
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
          {messages.length <= 1 && (
            <QuickPrompts
              hasCalendarPermission={hasCalendarPermission}
              onPromptClick={handleQuickPrompt}
            />
          )}

          {/* Messages Container with Conversation Component */}
          <Conversation className="flex-1 w-full max-w-5xl mx-auto">
            <ConversationContent className="space-y-4">
              {isMessagesLoading && currentSessionId ? (
                <div className="flex justify-center items-center h-32">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading chat history...</span>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg: any, idx: number) => {
                    return (
                      <div
                        key={msg.id || idx}
                        className={`flex ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        } flex-col gap-2`}
                      >
                        {msg.parts.map((part: any, partIdx: number) => {
                          // Render text parts
                          if (part.type === "text") {
                            return (
                              <div
                                key={partIdx}
                                className={`inline-flex max-w-[90%] p-3 sm:p-4 rounded-2xl shadow-sm wrap-break-word ${
                                  msg.role === "user"
                                    ? "bg-secondary text-secondary-foreground ml-auto"
                                    : "bg-accent text-accent-foreground"
                                }`}
                              >
                                <MessageContent
                                  content={part.text}
                                  hasCalendarPermission={hasCalendarPermission}
                                  onRequestCalendarPermission={
                                    requestCalendarPermission
                                  }
                                />
                              </div>
                            );
                          }

                          // Render calendar tool invocations
                          if (
                            part.type.startsWith("tool-") &&
                            "state" in part
                          ) {
                            const toolName = part.type.replace("tool-", "");
                            const toolPart = part as any; // Type assertion for tool parts

                            return (
                              <div
                                key={partIdx}
                                className="max-w-[90%] p-3 sm:p-4 rounded-lg border border-border bg-muted/50"
                              >
                                {toolPart.state === "input-streaming" && (
                                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <div className="w-3 h-3 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
                                    <span>Preparing to access calendar...</span>
                                  </div>
                                )}

                                {toolPart.state === "input-available" && (
                                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <div className="w-3 h-3 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
                                    <span>
                                      {toolName === "getTodayEvents" &&
                                        "Fetching today's schedule..."}
                                      {toolName === "getUpcomingEvents" &&
                                        "Fetching upcoming events..."}
                                      {toolName === "searchCalendarEvents" &&
                                        `Searching calendar for "${toolPart.input?.query}"...`}
                                      {toolName === "getEventsInRange" &&
                                        "Fetching events in date range..."}
                                    </span>
                                  </div>
                                )}

                                {toolPart.state === "output-available" && (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-primary text-sm font-medium">
                                      <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                      <span>Calendar data retrieved</span>
                                    </div>
                                    {toolPart.output?.events?.length > 0 && (
                                      <div className="text-xs text-muted-foreground">
                                        Found {toolPart.output.events.length}{" "}
                                        event
                                        {toolPart.output.events.length > 1
                                          ? "s"
                                          : ""}
                                      </div>
                                    )}
                                  </div>
                                )}

                                {toolPart.state === "output-error" && (
                                  <div className="flex items-center gap-2 text-destructive text-sm">
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                    <span>Failed to access calendar</span>
                                  </div>
                                )}
                              </div>
                            );
                          }

                          return null;
                        })}
                      </div>
                    );
                  })}

                  {status === "submitted" && <LoadingSteps />}
                  <div className="pb-24" />
                </>
              )}
            </ConversationContent>

            {/* Auto-scroll to bottom button */}
            <ConversationScrollButton />
          </Conversation>

          {/* Chat Input Component */}
          <ChatInput
            input={input}
            setInput={setInput}
            onSendMessage={sendMessage}
            isStreaming={status === "streaming"}
            hasCalendarPermission={hasCalendarPermission}
            onRequestCalendarPermission={requestCalendarPermission}
          />
        </div>
      </div>
    </div>
  );
}

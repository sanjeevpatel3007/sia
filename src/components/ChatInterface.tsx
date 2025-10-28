"use client";

import { useState, useEffect } from "react";
import { useChat as useVercelChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useAuth } from "@/contexts/AuthContext";
import { useChat as useChatContext, ChatMessage } from "@/contexts/ChatContext";
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
import {
  Message,
  MessageContent as MessageContentWrapper,
} from "@/components/ai-elements/message";

interface ChatInterfaceProps {
  chatId?: string;
  initialMessages?: ChatMessage[];
}

export default function ChatInterface({
  chatId,
  initialMessages = [],
}: ChatInterfaceProps) {
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

  // Convert initial messages to AI SDK format
  const convertedInitialMessages = initialMessages.map((msg) => ({
    id: msg.id || `${msg.role}-${Date.now()}`,
    role: msg.role as any,
    parts:
      msg.parts && msg.parts.length > 0
        ? msg.parts
        : [{ type: "text" as const, text: msg.content || "" }],
  }));

  // Initialize Vercel AI SDK's useChat hook with initial messages
  const {
    messages,
    sendMessage: sendVercelMessage,
    status,
  } = useVercelChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    messages:
      convertedInitialMessages.length > 0
        ? convertedInitialMessages
        : [
            {
              id: "1",
              role: "assistant",
              parts: [
                {
                  type: "text",
                  text: "Namaste! I'm SIA. I help your wellness and daily balance.",
                },
              ],
            },
          ],
    onFinish: async () => {
      // Refresh sessions to update sidebar
      await refreshSessions();
      console.log("Chat response finished and sessions refreshed");
    },
  });

  // Update context when chatId changes
  useEffect(() => {
    if (chatId && chatId !== currentSessionId) {
      switchToSession(chatId);
    } else if (!chatId && currentSessionId) {
      setCurrentSessionId(null);
      setCurrentMessages([]);
    }
  }, [
    chatId,
    currentSessionId,
    switchToSession,
    setCurrentSessionId,
    setCurrentMessages,
  ]);

  const sendMessage = async () => {
    if (!input.trim() || !session?.user?.id) return;

    const userInput = input;
    setInput("");

    // Use chatId (from URL) as the session ID
    // Backend will create session if it doesn't exist yet
    const sessionIdToUse = chatId || currentSessionId;

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
                  {messages.map((msg: any, idx: number) => (
                    <div key={msg.id || idx} className="space-y-0">
                      {msg.parts.map((part: any, partIdx: number) => {
                        const isToolPart =
                          typeof part.type === "string" &&
                          part.type.startsWith("tool-") &&
                          "state" in part;

                        // Render text parts inside Message UI
                        if (part.type === "text") {
                          return (
                            <Message
                              key={`${msg.id || idx}-${partIdx}`}
                              from={msg.role}
                            >
                              <MessageContentWrapper variant="contained">
                                <MessageContent
                                  content={part.text}
                                  hasCalendarPermission={hasCalendarPermission}
                                  onRequestCalendarPermission={
                                    requestCalendarPermission
                                  }
                                />
                              </MessageContentWrapper>
                            </Message>
                          );
                        }

                        // Render calendar tool invocations inside Message UI
                        if (isToolPart) {
                          const toolName = part.type.replace("tool-", "");
                          const toolPart = part as any;

                          return (
                            <Message
                              key={`${msg.id || idx}-${partIdx}`}
                              from={msg.role}
                            >
                              <MessageContentWrapper variant="flat">
                                <div className="flex w-full p-3 sm:p-4 rounded-lg border border-border bg-muted">
                                  {toolPart.state === "input-streaming" && (
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                      <div className="w-3 h-3 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
                                      <span>
                                        Preparing to access calendar...
                                      </span>
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
                              </MessageContentWrapper>
                            </Message>
                          );
                        }

                        return null;
                      })}
                    </div>
                  ))}

                  {status === "submitted" && <LoadingSteps />}
                  <div className="pb-24" />
                </>
              )}
            </ConversationContent>

            {/* Auto-scroll to bottom button */}
            <ConversationScrollButton />
          </Conversation>

          {/* Quick Prompts above input */}

          {/* Chat Input Component */}
          <ChatInput
            input={input}
            setInput={setInput}
            onSendMessage={sendMessage}
            isStreaming={status === "streaming"}
            hasCalendarPermission={hasCalendarPermission}
            onRequestCalendarPermission={requestCalendarPermission}
            messages={messages}
            handleQuickPrompt={(prompt: string) => setInput(prompt)}
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useChat as useVercelChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useChat as useChatContext, ChatMessage } from "@/contexts/ChatContext";
import ChatInput from "./ChatInput";
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
    isMessagesLoading,
    switchToSession,
    setCurrentSessionId,
    setCurrentMessages,
    refreshSessions,
  } = useChatContext();

  const [input, setInput] = useState("");

  // Convert initial messages to AI SDK format
  const convertedInitialMessages = initialMessages.map((msg, index) => ({
    id: msg.id || `${msg.role}-${index}`,
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

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Calendar Status Banner */}
          <div
            className={`border-b border-border p-3 flex items-center justify-between ${
              hasCalendarPermission
                ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                : "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Calendar Icon */}
              <div
                className={`p-2 rounded-full ${
                  hasCalendarPermission
                    ? "bg-green-100 dark:bg-green-900/30"
                    : "bg-blue-100 dark:bg-blue-900/30"
                }`}
              >
                <Image
                  src="/images/calendar.png"
                  alt="Google Calendar"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </div>

              {/* Status Text */}
              <div className="flex flex-col">
                <span
                  className={`text-sm font-medium ${
                    hasCalendarPermission
                      ? "text-green-800 dark:text-green-200"
                      : "text-blue-800 dark:text-blue-200"
                  }`}
                >
                  {hasCalendarPermission
                    ? "Google Calendar Connected"
                    : "Connect Google Calendar"}
                </span>
                <span
                  className={`text-xs ${
                    hasCalendarPermission
                      ? "text-green-600 dark:text-green-400"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {hasCalendarPermission
                    ? "Ask about your schedule for personalized wellness guidance!"
                    : "Get personalized wellness guidance based on your schedule"}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex items-center gap-2">
              {hasCalendarPermission ? (
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-green-600 dark:text-green-400"
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
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    Connected
                  </span>
                </div>
              ) : (
                <button
                  onClick={requestCalendarPermission}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                >
                  <Image
                    src="/images/calendar.png"
                    alt="Google Calendar"
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                  Connect
                </button>
              )}
            </div>
          </div>

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
                  {messages.length === 1 && (
                    <div className="flex flex-col items-center justify-center h-[40vh] relative w-full">
                      <div className="absolute inset-0 pointer-events-none opacity-60 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-accent/10 via-background to-background"></div>
                      <div className="relative z-10 bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-6 sm:p-8 max-w-xl w-full text-center space-y-4">
                        <div className="flex items-center justify-center gap-3">
                          <Image
                            src="/images/calendar.png"
                            alt="Google Calendar"
                            width={28}
                            height={28}
                            className="w-7 h-7"
                          />
                          <span className="text-sm text-muted-foreground">
                            Personalized by your Google Calendar and memory
                          </span>
                        </div>
                        <h2 className="text-xl font-semibold">
                          Start a new conversation
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Ask anything. If connected, Ill use your schedule. I
                          also remember preferences to tailor guidance.
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          <button
                            onClick={() =>
                              setInput("Plan my day for energy and focus")
                            }
                            className="px-3 py-1.5 text-xs rounded-full border border-border hover:bg-muted transition-colors"
                          >
                            Plan my day
                          </button>
                          <button
                            onClick={() =>
                              setInput("Suggest a 10-min breathing routine now")
                            }
                            className="px-3 py-1.5 text-xs rounded-full border border-border hover:bg-muted transition-colors"
                          >
                            Breathing routine
                          </button>
                          <button
                            onClick={() =>
                              setInput("Whats on my calendar this afternoon?")
                            }
                            className="px-3 py-1.5 text-xs rounded-full border border-border hover:bg-muted transition-colors"
                          >
                            Todays schedule
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {messages.length > 0 &&
                    messages.map((msg: any, idx: number) => (
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
                                    hasCalendarPermission={
                                      hasCalendarPermission
                                    }
                                    onRequestCalendarPermission={
                                      requestCalendarPermission
                                    }
                                  />
                                </MessageContentWrapper>
                              </Message>
                            );
                          }

                          // Render tool invocations inside Message UI
                          if (isToolPart) {
                            const toolName = part.type.replace("tool-", "");
                            const toolPart = part as any;

                            // Check if this is a memory tool
                            const isMemoryTool =
                              toolName === "saveMemory" ||
                              toolName === "saveConversationMemories";

                            return (
                              <Message
                                key={`${msg.id || idx}-${partIdx}`}
                                from={msg.role}
                              >
                                <MessageContentWrapper variant="flat">
                                  <div className="flex w-full p-3 sm:p-4 rounded-lg border border-border bg-muted">
                                    {/* Input Streaming State */}
                                    {toolPart.state === "input-streaming" && (
                                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                        <div className="w-3 h-3 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
                                        <span>
                                          {isMemoryTool
                                            ? "Preparing to save memory..."
                                            : "Preparing to access calendar..."}
                                        </span>
                                      </div>
                                    )}

                                    {/* Input Available State */}
                                    {toolPart.state === "input-available" && (
                                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                        <div className="w-3 h-3 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
                                        <span>
                                          {toolName === "getTodayEvents" &&
                                            "Fetching today's schedule..."}
                                          {toolName === "getUpcomingEvents" &&
                                            "Fetching upcoming events..."}
                                          {toolName ===
                                            "searchCalendarEvents" &&
                                            `Searching calendar for "${toolPart.input?.query}"...`}
                                          {toolName === "getEventsInRange" &&
                                            "Fetching events in date range..."}
                                          {toolName === "saveMemory" &&
                                            "Saving memory..."}
                                          {toolName ===
                                            "saveConversationMemories" &&
                                            "Extracting conversation memories..."}
                                        </span>
                                      </div>
                                    )}

                                    {/* Output Available State */}
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
                                          <span>
                                            {isMemoryTool
                                              ? "Memory saved"
                                              : "Calendar data retrieved"}
                                          </span>
                                        </div>
                                        {toolPart.output?.events?.length >
                                          0 && (
                                          <div className="text-xs text-muted-foreground">
                                            Found{" "}
                                            {toolPart.output.events.length}{" "}
                                            event
                                            {toolPart.output.events.length > 1
                                              ? "s"
                                              : ""}
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Output Error State */}
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
                                        <span>
                                          {isMemoryTool
                                            ? "Failed to save memory"
                                            : "Failed to access calendar"}
                                        </span>
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

                  {/* Show loading when submitted OR when streaming but last message has no content yet */}
                  {(status === "submitted" ||
                    (status === "streaming" &&
                      messages.length > 0 &&
                      messages[messages.length - 1].role === "assistant" &&
                      !messages[messages.length - 1].parts.some(
                        (p: any) =>
                          p.type === "text" && p.text.trim().length > 0
                      ))) && <LoadingSteps />}
                  <div className="pb-28" />
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

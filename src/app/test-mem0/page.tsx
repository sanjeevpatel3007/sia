"use client";

import { useState } from "react";

export default function TestMem0Page() {
  const [userId, setUserId] = useState("test-user-123");
  const [message, setMessage] = useState("");
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const addToConversation = () => {
    if (!message.trim()) return;

    const newMessage = {
      role: "user" as const,
      content: message,
    };

    setConversationHistory([...conversationHistory, newMessage]);
    setMessage("");
  };

  const storeMemories = async () => {
    if (conversationHistory.length === 0) {
      setResult("Please add some messages to the conversation first!");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/mem0/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          messages: conversationHistory,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(
          `Successfully stored memories! ${JSON.stringify(data, null, 2)}`
        );
      } else {
        setResult(`Error: ${data.error || "Failed to store memories"}`);
      }
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const searchMemories = async () => {
    if (!searchQuery.trim()) {
      setResult("Please enter a search query!");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const response = await fetch(
        `/api/mem0/search?userId=${encodeURIComponent(userId)}&query=${encodeURIComponent(searchQuery)}`
      );

      const data = await response.json();

      if (response.ok) {
        setMemories(data.memories || []);
        setResult(`Found ${data.memories?.length || 0} memories`);
      } else {
        setResult(`Error: ${data.error || "Failed to search memories"}`);
        setMemories([]);
      }
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
      setMemories([]);
    } finally {
      setLoading(false);
    }
  };

  const clearConversation = () => {
    setConversationHistory([]);
    setResult("");
  };

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Mem0 Test Page</h1>
          <p className="text-muted-foreground">
            Test memory storage and retrieval with Mem0
          </p>
        </div>

        {/* User ID Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">User ID</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full p-3 border rounded-lg bg-background"
            placeholder="Enter user ID"
          />
        </div>

        {/* Conversation Builder */}
        <div className="space-y-4 p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold">Build Conversation</h2>

          <div className="space-y-2">
            <label className="text-sm font-medium">Add Message</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addToConversation()}
                className="flex-1 p-3 border rounded-lg bg-background"
                placeholder="Enter a message..."
              />
              <button
                onClick={addToConversation}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Add
              </button>
            </div>
          </div>

          {/* Conversation History */}
          {conversationHistory.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">
                  Conversation History ({conversationHistory.length} messages)
                </label>
                <button
                  onClick={clearConversation}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Clear
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2 p-4 bg-muted/30 rounded-lg">
                {conversationHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-background rounded border-l-4 border-primary"
                  >
                    <div className="text-xs font-semibold text-muted-foreground mb-1">
                      {msg.role.toUpperCase()}
                    </div>
                    <div className="text-sm">{msg.content}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={storeMemories}
            disabled={loading || conversationHistory.length === 0}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Storing..." : "Store Memories"}
          </button>
        </div>

        {/* Search Memories */}
        <div className="space-y-4 p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold">Search Memories</h2>

          <div className="space-y-2">
            <label className="text-sm font-medium">Search Query</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchMemories()}
                className="flex-1 p-3 border rounded-lg bg-background"
                placeholder="What do you want to find?"
              />
              <button
                onClick={searchMemories}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>

          {/* Search Results */}
          {memories.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Search Results ({memories.length} found)
              </label>
              <div className="max-h-64 overflow-y-auto space-y-2 p-4 bg-muted/30 rounded-lg">
                {memories.map((memory, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-background rounded border-l-4 border-blue-500"
                  >
                    <div className="text-sm">{memory.memory || JSON.stringify(memory)}</div>
                    {memory.score && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Score: {memory.score.toFixed(4)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Result Display */}
        {result && (
          <div
            className={`p-4 rounded-lg ${
              result.startsWith("Error")
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-green-50 text-green-800 border border-green-200"
            }`}
          >
            <pre className="whitespace-pre-wrap text-sm">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

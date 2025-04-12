"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Id } from "@/convex/_generated/dataModel"; // Removed Doc
import { Button } from "@/components/ui/button";
import { ChatRequestBody, StreamMessageType, MessageRole } from "@/lib/types";
import WelcomeMessage from "@/components/WelcomeMessage";
import { createSSEParser } from "@/lib/SSEParser";
import { MessageBubble } from "@/components/MessageBubble";
import { SendHorizonal } from "lucide-react";
import { getConvexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { NavigationContext } from "@/lib/NavigationProvider";

// Custom message type matching your convex/messages.ts
interface Message {
  _id: Id<"messages">;
  chatId: Id<"chats">;
  content: string;
  role: "user" | "assistant";
  createdAt: number;
  _creationTime: number;
  userId: string;
}

interface ChatInterfaceProps {
  chatId: Id<"chats">;
  initialMessages: Message[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

export default function ChatInterface({
  chatId,
  initialMessages,
}: ChatInterfaceProps) {
  const { setRecentChatId } = useContext(NavigationContext);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState("");
  const [currentTool, setCurrentTool] = useState<{
    name: string;
    input: unknown;
  } | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const streamBuffer = useRef<string>("");
  const updateTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Sync isDarkMode with the document's dark class
  useEffect(() => {
    const handleClassChange = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    handleClassChange(); // Initial check
    const observer = new MutationObserver(handleClassChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  
  // Set this chat as the recent chat when loaded
  useEffect(() => {
    setRecentChatId(chatId);
  }, [chatId, setRecentChatId]);

  const debouncedSetStreamedResponse = useCallback(
    (newContent: string): void => {
      // Check if buffer is getting too large and truncate if necessary
      if (streamBuffer.current.length > 100000) {
        console.warn("Stream buffer exceeding safe size, truncating");
        streamBuffer.current = streamBuffer.current.slice(-50000); // Keep last 50K chars
      }
      
      streamBuffer.current += newContent;
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      
      // More aggressive adjustment of update frequency based on content length
      let updateInterval = 50; // Default for small content
      if (streamBuffer.current.length > 10000) updateInterval = 200;
      if (streamBuffer.current.length > 50000) updateInterval = 500;
      
      updateTimeoutRef.current = setTimeout(() => {
        // If the buffer is very large, consider truncating before setting state
        if (streamBuffer.current.length > 200000) {
          setStreamedResponse(streamBuffer.current.slice(-100000) +
            "\n\n[Response truncated due to size limitations]");
        } else {
          setStreamedResponse(streamBuffer.current);
        }
        streamBuffer.current = "";
      }, updateInterval);
    },
    [setStreamedResponse]
  );

  useEffect(() => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [messages, streamedResponse]);

  const formatToolOutput = (output: unknown): string => {
    if (typeof output === "string") return output;
    return JSON.stringify(output, null, 2);
  };

  const formatTerminalOutput = (
    tool: string,
    input: unknown,
    output: unknown
  ) => {
    const terminalHtml = `<div class="bg-[#1e1e1e] dark:bg-[#2A2A2A] text-white dark:text-[#D4D4D4] font-mono p-4 rounded-lg my-3 overflow-x-auto whitespace-normal max-w-[600px] shadow-lg border border-gray-800/50 dark:border-gray-600/50">
      <div class="flex items-center gap-2 border-b border-gray-700 dark:border-gray-600 pb-2">
        <span class="text-gray-300 dark:text-gray-400 ml-1 text-sm font-medium">~/${tool}</span>
        <div class="flex ml-auto gap-1.5">
          <span class="text-red-500">●</span>
          <span class="text-yellow-500">●</span>
          <span class="text-green-500">●</span>
        </div>
      </div>
      <div class="text-gray-400 dark:text-gray-500 mt-3">
        <span>Input</span>
      </div>
      <pre class="text-yellow-400 dark:text-yellow-300 mt-2 whitespace-pre-wrap overflow-x-auto bg-black/20 p-2 rounded">${formatToolOutput(
        input
      )}</pre>
      <div class="text-gray-400 dark:text-gray-500 mt-4">
        <span>Output</span>
      </div>
      <pre class="text-green-400 dark:text-green-300 mt-2 whitespace-pre-wrap overflow-x-auto bg-black/20 p-2 rounded">${formatToolOutput(
        output
      )}</pre>
    </div>`;
    return `---START---\n${terminalHtml}\n---END---`;
  };

  const processStream = async (
    reader: ReadableStreamDefaultReader<Uint8Array>,
    onChunk: (chunk: string) => Promise<void>
  ) => {
    try {
      // Use a smaller buffer size for decoding to prevent memory issues
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Process in smaller chunks if the value is large
        if (value && value.length > 16384) { // 16KB chunks
          const chunkSize = 16384;
          for (let i = 0; i < value.length; i += chunkSize) {
            const chunk = value.slice(i, Math.min(i + chunkSize, value.length));
            await onChunk(decoder.decode(chunk, { stream: true }));
          }
        } else if (value) {
          await onChunk(decoder.decode(value, { stream: true }));
        }
      }
    } finally {
      reader.releaseLock();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    setInput("");
    setStreamedResponse("");
    setCurrentTool(null);
    setIsLoading(true);

    const optimisticUserMessage: Message = {
      _id: `temp_${Date.now()}` as Id<"messages">,
      chatId,
      content: trimmedInput,
      role: "user",
      createdAt: Date.now(),
      _creationTime: Date.now(),
      userId: "temp_user", // Placeholder; ideally fetch from auth
    };

    setMessages((prev) => [...prev, optimisticUserMessage]);

    let fullResponse = "";

    try {
      // Make sure we have at least one message in the request
      const apiMessages = messages.length > 0
        ? messages.map(msg => ({
            role: msg.role as MessageRole,
            content: msg.content
          }))
        : [{
            role: "user" as MessageRole,
            content: trimmedInput
          }];
      
      const requestBody: ChatRequestBody = {
        messages: apiMessages,
        newMessage: trimmedInput,
        chatId,
      };

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
      const response = await fetch(`${baseUrl}/api/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error(await response.text());
      if (!response.body) throw new Error("No response body available");

      const parser = createSSEParser();
      const reader = response.body.getReader();

      await processStream(reader, async (chunk) => {
        const messages = parser.parse(chunk);

        for (const message of messages) {
          switch (message.type) {
            case StreamMessageType.Token:
              if ("token" in message) {
                // More aggressive size management
                const maxResponseSize = 75000; // Reduced from 100K to 75K
                
                // Check if adding this token would make the response too large
                if (fullResponse.length > maxResponseSize) {
                  // If we've already exceeded the limit, don't add more content
                  if (!fullResponse.includes("Response truncated due to size limitations")) {
                    fullResponse += "\n\n[Response truncated due to size limitations]";
                    debouncedSetStreamedResponse(fullResponse);
                  }
                } else if (fullResponse.length + message.token.length > maxResponseSize) {
                  // If this token would push us over the limit, truncate
                  const remainingSpace = Math.max(0, maxResponseSize - fullResponse.length - 50);
                  if (remainingSpace > 0) {
                    fullResponse += message.token.slice(0, remainingSpace);
                  }
                  fullResponse += "\n\n[Response truncated due to size limitations]";
                  debouncedSetStreamedResponse(fullResponse);
                } else {
                  // Normal case - add the token
                  fullResponse += message.token;
                  
                  // Adaptive UI update frequency based on response size
                  if (fullResponse.length < 5000) {
                    // For small responses, update frequently
                    debouncedSetStreamedResponse(fullResponse);
                  } else if (fullResponse.length < 20000) {
                    // For medium responses, update every 50 tokens
                    if (fullResponse.length % 50 === 0) {
                      debouncedSetStreamedResponse(fullResponse);
                    }
                  } else {
                    // For large responses, update every 200 tokens
                    if (fullResponse.length % 200 === 0) {
                      debouncedSetStreamedResponse(fullResponse);
                    }
                  }
                }
              }
              break;

            case StreamMessageType.ToolStart:
              if ("tool" in message) {
                setCurrentTool({
                  name: message.tool,
                  input: message.input,
                });
                fullResponse += formatTerminalOutput(
                  message.tool,
                  message.input,
                  "Processing..."
                );
                setStreamedResponse(fullResponse);
              }
              break;

            case StreamMessageType.ToolEnd:
              if ("tool" in message && currentTool) {
                const lastTerminalIndex = fullResponse.lastIndexOf(
                  '<div class="bg-[#1e1e1e]'
                );
                if (lastTerminalIndex !== -1) {
                  fullResponse =
                    fullResponse.substring(0, lastTerminalIndex) +
                    formatTerminalOutput(
                      message.tool,
                      currentTool.input,
                      message.output
                    );
                  setStreamedResponse(fullResponse);
                }
                setCurrentTool(null);
              }
              break;

            case StreamMessageType.Error:
              if ("error" in message) {
                throw new Error(message.error);
              }
              break;

            case StreamMessageType.Done:
              const assistantMessage: Message = {
                _id: `temp_assistant_${Date.now()}` as Id<"messages">,
                chatId,
                content: fullResponse,
                role: "assistant",
                createdAt: Date.now(),
                _creationTime: Date.now(),
                userId: "temp_user", // Placeholder
              };

              const convex = getConvexClient();
              await convex.mutation(api.messages.store, {
                chatId,
                content: fullResponse,
                role: "assistant",
              });

              setMessages((prev) => [...prev, assistantMessage]);
              setStreamedResponse("");
              return;
          }
        }
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) =>
        prev.filter((msg) => msg._id !== optimisticUserMessage._id)
      );
      setStreamedResponse(
        formatTerminalOutput(
          "error",
          "Failed to process message",
          error instanceof Error ? error.message : "Unknown error"
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.main
      className="flex flex-col h-[calc(100vh-theme(spacing.14))] bg-white dark:bg-[#1A1A1A]/80"
      suppressHydrationWarning
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.section
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto relative scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
        variants={sectionVariants}
      >
        <div className="fixed inset-0 -z-30 bg-gradient-to-b from-white to-gray-50 dark:from-[#1A1A1A] dark:to-[#2A2A2A] opacity-70" />
        <motion.div className="max-w-4xl mx-auto p-4 space-y-6" variants={sectionVariants}>
          <AnimatePresence mode="popLayout">
            {messages?.length === 0 && <WelcomeMessage key="welcome-message" />}
            {messages?.map((message: Message) => (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Check both role field and userId field for backward compatibility */}
                <MessageBubble
                  content={message.content}
                  isUser={message.role === "user" || message.userId === "user"}
                />
              </motion.div>
            ))}
            {streamedResponse && (
              <motion.div
                key="streamed-response"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <MessageBubble content={streamedResponse} />
              </motion.div>
            )}
            {isLoading && !streamedResponse && (
              <motion.div
                key="loading-indicator"
                className="flex justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="rounded-2xl px-5 py-3 bg-gradient-to-br from-white to-gray-50 dark:from-[#2A2A2A] dark:to-[#3A3A3A] text-gray-900 dark:text-[#D4D4D4] rounded-bl-none shadow-sm ring-1 ring-inset ring-gray-200/50 dark:ring-gray-600/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={`loading-dot-${i}`}
                          className="h-2 w-8 rounded-full bg-blue-500 dark:bg-[#4A90E2]"
                          animate={{ scaleX: [1, 0.4, 1], opacity: [0.7, 0.4, 0.7] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </motion.div>
      </motion.section>

      <motion.footer
        className="border-t bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-sm p-4 shadow-sm relative border-gray-200 dark:border-gray-600/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
      >
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
          <div className="relative flex items-center">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50/50 to-blue-50 dark:from-[#4A90E2]/20 dark:via-[#4A90E2]/10 dark:to-[#4A90E2]/20 rounded-2xl"
              initial={false}
              animate={
                isFocused
                  ? {
                      scale: 1,
                      opacity: 1,
                      background: [
                        "linear-gradient(to right, rgb(239 246 255), rgb(243 232 255 / 0.5), rgb(239 246 255))",
                        "linear-gradient(to right, rgb(243 232 255 / 0.5), rgb(239 246 255), rgb(243 232 255 / 0.5))",
                        "linear-gradient(to right, rgb(239 246 255), rgb(243 232 255 / 0.5), rgb(239 246 255))",
                      ].map((grad) =>
                        isDarkMode
                          ? grad.replace(/rgb\(\d+\s+\d+\s+\d+(?: \/ 0\.\d+)?\)/g, "#4A90E2/20")
                          : grad
                      ),
                    }
                  : { scale: 0.95, opacity: 0 }
              }
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.shiftKey) {
                  e.preventDefault();
                  setInput(input + "\n");
                } else if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="How can C.A.T.E help?"
              className="message-input flex-1 py-3.5 px-5 rounded-2xl border border-gray-200 dark:border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#4A90E2] focus:border-transparent pr-12 bg-white/50 dark:bg-[#2A2A2A]/50 backdrop-blur-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-[#D4D4D4] relative z-10 transition-all duration-200 text-[15px] resize-none min-h-[50px] max-h-[200px]"
              disabled={isLoading}
            />
            <motion.div className="absolute right-1.5" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`rounded-xl h-10 w-10 p-0 flex items-center justify-center transition-all ${
                  input.trim()
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-[#4A90E2] dark:to-[#357ABD] dark:hover:from-[#357ABD] dark:hover:to-[#2A6099] text-white shadow-lg"
                    : "bg-gray-100 dark:bg-[#3A3A3A] text-gray-400 dark:text-gray-500"
                }`}
              >
                <motion.div
                  animate={isLoading ? { rotate: 360, scale: [1, 1.1, 1] } : { rotate: 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <SendHorizonal className="w-5 h-5" />
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </form>
      </motion.footer>
    </motion.main>
  );
}
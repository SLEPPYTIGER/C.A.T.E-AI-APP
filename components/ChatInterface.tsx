"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { ChatRequestBody, StreamMessageType } from "@/lib/types";
import WelcomeMessage from "@/components/WelcomeMessage";
import { createSSEParser } from "@/lib/SSEParser";
import { MessageBubble } from "@/components/MessageBubble";
import { SendHorizonal } from "lucide-react";
import { getConvexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInterfaceProps {
  chatId: Id<"chats">;
  initialMessages: Doc<"messages">[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

export default function ChatInterface({
  chatId,
  initialMessages,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Doc<"messages">[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState("");
  const [currentTool, setCurrentTool] = useState<{
    name: string;
    input: unknown;
  } | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const streamBuffer = useRef<string>("");
  const updateTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const debouncedSetStreamedResponse = useCallback((newContent: string): void => {
    streamBuffer.current += newContent;
    
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      setStreamedResponse(streamBuffer.current);
      streamBuffer.current = "";
    }, 50); // 50ms debounce
  }, [setStreamedResponse]);

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
    const terminalHtml = `<div class="bg-[#1e1e1e] text-white font-mono p-4 rounded-lg my-3 overflow-x-auto whitespace-normal max-w-[600px] shadow-lg border border-gray-800/50">
      <div class="flex items-center gap-2 border-b border-gray-700 pb-2">
        <span class="text-gray-300 ml-1 text-sm font-medium">~/${tool}</span>
        <div class="flex ml-auto gap-1.5">
          <span class="text-red-500">●</span>
          <span class="text-yellow-500">●</span>
          <span class="text-green-500">●</span>
        </div>
      </div>
      <div class="text-gray-400 mt-3">
        <span>Input</span>
      </div>
      <pre class="text-yellow-400 mt-2 whitespace-pre-wrap overflow-x-auto bg-black/20 p-2 rounded">${formatToolOutput(input)}</pre>
      <div class="text-gray-400 mt-4">
        <span>Output</span>
      </div>
      <pre class="text-green-400 mt-2 whitespace-pre-wrap overflow-x-auto bg-black/20 p-2 rounded">${formatToolOutput(output)}</pre>
    </div>`;

    return `---START---\n${terminalHtml}\n---END---`;
  };

  const processStream = async (
    reader: ReadableStreamDefaultReader<Uint8Array>,
    onChunk: (chunk: string) => Promise<void>
  ) => {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        await onChunk(new TextDecoder().decode(value));
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

    const optimisticUserMessage: Doc<"messages"> = {
      _id: `temp_${Date.now()}`,
      chatId,
      content: trimmedInput,
      role: "user",
      createdAt: Date.now(),
    } as Doc<"messages">;

    setMessages((prev) => [...prev, optimisticUserMessage]);

    let fullResponse = "";

    try {
      const requestBody: ChatRequestBody = {
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        newMessage: trimmedInput,
        chatId,
      };

      // Get the base URL from environment variable or use relative path
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
      const response = await fetch(`${baseUrl}/api/chat/stream`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          // Add cache control headers
          "Cache-Control": "no-cache",
          "Pragma": "no-cache"
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
                fullResponse += message.token;
                debouncedSetStreamedResponse(fullResponse);
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
              const assistantMessage: Doc<"messages"> = {
                _id: `temp_assistant_${Date.now()}`,
                chatId,
                content: fullResponse,
                role: "assistant",
                createdAt: Date.now(),
              } as Doc<"messages">;

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
      className="flex flex-col h-[calc(100vh-theme(spacing.14))]"
      suppressHydrationWarning
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.section
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto relative"
        variants={sectionVariants}
      >
        {/* Simple gradient background */}
        <div className="fixed inset-0 -z-30 bg-gradient-to-b from-white to-gray-50 opacity-70" />

        <motion.div 
          className="max-w-4xl mx-auto p-4 space-y-6"
          variants={sectionVariants}
        >
          <AnimatePresence mode="popLayout">
            {messages?.length === 0 && <WelcomeMessage />}

            {messages?.map((message: Doc<"messages">) => (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <MessageBubble
                  content={message.content}
                  isUser={message.role === "user"}
                />
              </motion.div>
            ))}

            {streamedResponse && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <MessageBubble 
                  content={streamedResponse} 
                />
              </motion.div>
            )}

            {isLoading && !streamedResponse && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="rounded-2xl px-5 py-3 bg-gradient-to-br from-white to-gray-50 text-gray-900 rounded-bl-none shadow-sm ring-1 ring-inset ring-gray-200/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="h-2 w-8 rounded-full bg-blue-500"
                          animate={{
                            scaleX: [1, 0.4, 1],
                            opacity: [0.7, 0.4, 0.7],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
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
        className="border-t bg-white/80 backdrop-blur-sm p-4 shadow-sm relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
      >
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
          <div className="relative flex items-center">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50/50 to-blue-50 rounded-2xl"
              initial={false}
              animate={isFocused ? {
                scale: 1,
                opacity: 1,
                background: [
                  "linear-gradient(to right, rgb(239 246 255), rgb(243 232 255 / 0.5), rgb(239 246 255))",
                  "linear-gradient(to right, rgb(243 232 255 / 0.5), rgb(239 246 255), rgb(243 232 255 / 0.5))",
                  "linear-gradient(to right, rgb(239 246 255), rgb(243 232 255 / 0.5), rgb(239 246 255))",
                ]
              } : {
                scale: 0.95,
                opacity: 0
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Message AI Agent..."
              className="message-input flex-1 py-3.5 px-5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 bg-white/50 backdrop-blur-sm placeholder:text-gray-500 relative z-10 transition-all duration-200 text-[15px]"
              disabled={isLoading}
            />
            <motion.div
              className="absolute right-1.5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`rounded-xl h-10 w-10 p-0 flex items-center justify-center transition-all ${
                  input.trim()
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <motion.div
                  animate={isLoading ? {
                    rotate: 360,
                    scale: [1, 1.1, 1],
                  } : { rotate: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
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
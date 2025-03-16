"use client";

import { useEffect, useRef, useState } from "react";
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

export default function ChatInterface({
  chatId,
  initialMessages,
}: ChatInterfaceProps) {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Doc<"messages">[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState("");
  const [currentTool, setCurrentTool] = useState<{
    name: string;
    input: unknown;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
                setStreamedResponse(fullResponse);
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

  if (!mounted) {
    return null;
  }

  return (
    <main className="flex flex-col h-[calc(100vh-theme(spacing.14))]" suppressHydrationWarning>
      <section
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto relative"
      >
        {/* Animated background */}
        <div className="fixed inset-0 -z-30 bg-[radial-gradient(circle_at_50%_120%,#ffffff,#f3f4f6_40%,#e5e7eb_80%)] opacity-70" />
        
        {/* Animated grid with blur effect */}
        <div className="fixed inset-0 -z-20 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]" />

        {/* Floating orbs */}
        <div className="fixed top-1/4 -left-20 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob -z-10" />
        <div className="fixed -bottom-8 left-1/3 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 -z-10" />
        <div className="fixed top-1/3 -right-20 w-40 h-40 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 -z-10" />

        <div className="max-w-4xl mx-auto p-4 space-y-6">
          <AnimatePresence mode="popLayout">
            {messages?.length === 0 && <WelcomeMessage />}

            {messages?.map((message: Doc<"messages">) => (
              <div key={message._id} className="opacity-100">
                <MessageBubble
                  content={message.content}
                  isUser={message.role === "user"}
                />
              </div>
            ))}

            {streamedResponse && (
              <div className="opacity-100">
                <MessageBubble 
                  content={streamedResponse} 
                />
              </div>
            )}

            {isLoading && !streamedResponse && (
              <div className="flex justify-start">
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
              </div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </section>

      <motion.footer
        className="border-t bg-white/80 backdrop-blur-sm p-4 shadow-sm relative"
        initial={false}
        animate={isInputFocused ? { height: "auto", scale: 1 } : { height: "auto", scale: 1 }}
      >
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
          <div className="relative flex items-center">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50/50 to-blue-50 rounded-2xl"
              initial={false}
              animate={isInputFocused ? {
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
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder="Message AI Agent..."
              className="flex-1 py-3.5 px-5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 bg-white/50 backdrop-blur-sm placeholder:text-gray-500 relative z-10 transition-all duration-200 text-[15px]"
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
    </main>
  );
}
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
<<<<<<< HEAD
import { BotIcon, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { useContext, useState, useEffect } from "react";
import { NavigationContext } from "@/lib/NavigationProvider";
=======
import { BotIcon } from "lucide-react";
>>>>>>> a89900a86c9edb2d4213a789d9bdfbf54be1d2ac

interface MessageBubbleProps {
  content: string;
  isUser?: boolean;
}

<<<<<<< HEAD
const extractCodeBlocks = (content: string): { parts: { text: string; isCode: boolean }[] } => {
  const parts: { text: string; isCode: boolean }[] = [];
  let remainingContent = content;

  const codeBlockRegex = /```[\s\S]*?```|(Tool output:|Search results:|Command output:)[\s\S]*?(?=\n\n|$)/g;
  let match;

  while ((match = codeBlockRegex.exec(remainingContent)) !== null) {
    const matchStart = match.index;
    const matchEnd = matchStart + match[0].length;

    if (matchStart > 0) {
      parts.push({
        text: remainingContent.slice(0, matchStart).trim(),
        isCode: false,
      });
    }

    const codeContent = match[0].startsWith("```") ? match[0].slice(3, -3).trim() : match[0].trim();
    parts.push({
      text: codeContent,
      isCode: true,
    });

    remainingContent = remainingContent.slice(matchEnd).trim();
  }

  if (remainingContent.length > 0) {
    parts.push({
      text: remainingContent.trim(),
      isCode: false,
    });
  }

  return { parts };
};

const isCodeBlock = (content: string): boolean => {
  return /```[\s\S]*?```|(Tool output:|Search results:|Command output:)/.test(content);
};

const TerminalHeader = ({ language }: { language: string }) => (
  <div className="flex items-center justify-between px-3 py-2 bg-[#1a1a1a] rounded-t-md">
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-gray-400">{language}</span>
    </div>
    <div className="flex items-center gap-2">
      <button className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1">
        <Terminal className="h-3.5 w-3.5" />
        Copy
      </button>
      <button className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1">
        <Terminal className="h-3.5 w-3.5" />
        Edit
      </button>
    </div>
  </div>
);

const CodeBlock = ({ content }: { content: string }) => {
  const language = content.startsWith("def ") || content.includes("print(") ? "python" : "text";

  return (
    <div className="font-mono text-[13px] w-full my-2">
      <TerminalHeader language={language} />
      <div className="bg-[#1a1a1a] p-3 rounded-b-md overflow-x-auto">
        <div className="text-[#d4d4d4]">
          {content.split('\n').map((line, i) => (
            <motion.div
              key={i}
              className="flex"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
            >
              <span className="text-[#4a4a4a] mr-4 select-none w-8 text-right font-medium">{i + 1}</span>
              <span className="flex-1 font-medium">{line}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const formatMessage = (content: string): string => {
  content = content.replace(/\\\\/g, "\\");
  content = content.replace(/\\n/g, "\n");
  content = content.replace(/---START---\n?/g, "").replace(/\n?---END---/g, "");
=======
const formatMessage = (content: string): string => {
  // First unescape backslashes
  content = content.replace(/\\\\/g, "\\");

  // Then handle newlines
  content = content.replace(/\\n/g, "\n");

  // Remove only the markers but keep the content between them
  content = content.replace(/---START---\n?/g, "").replace(/\n?---END---/g, "");

  // Trim any extra whitespace that might be left
>>>>>>> a89900a86c9edb2d4213a789d9bdfbf54be1d2ac
  return content.trim();
};

export function MessageBubble({ content, isUser }: MessageBubbleProps) {
  const { user } = useUser();
<<<<<<< HEAD
  const { isDarkMode } = useContext(NavigationContext);
  const formattedContent = formatMessage(content);
  const shouldShowTerminal = !isUser && isCodeBlock(formattedContent);
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentLength, setContentLength] = useState(0);
  
  // Calculate content length on mount and handle very large content
  useEffect(() => {
    setContentLength(formattedContent.length);
    
    // If content is extremely large, force truncation for performance
    if (formattedContent.length > 50000 && !isExpanded) {
      console.warn(`Very large message detected (${formattedContent.length} chars), forcing truncation`);
      // We don't set isExpanded here to allow user to expand if needed
    }
  }, [formattedContent]);

  // More aggressive truncation for large messages
  const truncationThreshold = 5000; // Reduced from 8000 to 5000
  const shouldTruncate = !shouldShowTerminal && contentLength > truncationThreshold && !isExpanded;
  
  // Create truncated content if needed, with more aggressive truncation for very large content
  const displayContent = shouldTruncate
    ? formattedContent.length > 20000
      ? formattedContent.slice(0, 3000) + "... [message truncated due to size]"
      : formattedContent.slice(0, truncationThreshold) + "..."
    : formattedContent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex mb-6 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`relative rounded-2xl px-4 py-2.5 max-w-[85%] md:max-w-[75%] shadow-sm ring-1 ring-inset ${
          isUser
            ? "bg-blue-600 text-white rounded-br-none ring-blue-700"
            : shouldShowTerminal
            ? "bg-transparent ring-0"
            : isDarkMode
            ? "bg-gray-800 text-gray-200 rounded-bl-none ring-gray-700"
            : "bg-white text-gray-900 rounded-bl-none ring-gray-200"
        }`}
      >
        {shouldShowTerminal ? (
          <div className="whitespace-pre-wrap text-[15px] leading-relaxed">
            {extractCodeBlocks(formattedContent).parts.map((part, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {part.isCode ? (
                  <CodeBlock content={part.text} />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: part.text }} />
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="whitespace-pre-wrap text-[15px] leading-relaxed">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              dangerouslySetInnerHTML={{ __html: displayContent }}
            />
            
            {shouldTruncate && (
              <button
                onClick={() => setIsExpanded(true)}
                className="mt-2 text-blue-500 dark:text-blue-400 hover:underline font-medium"
              >
                Show full response ({Math.round(contentLength / 1000)}K characters)
              </button>
            )}
          </div>
        )}
=======

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`rounded-2xl px-4 py-2.5 max-w-[85%] md:max-w-[75%] shadow-sm ring-1 ring-inset relative ${
          isUser
            ? "bg-blue-600 text-white rounded-br-none ring-blue-700"
            : "bg-white text-gray-900 rounded-bl-none ring-gray-200"
        }`}
      >
        <div className="whitespace-pre-wrap text-[15px] leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: formatMessage(content) }} />
        </div>
>>>>>>> a89900a86c9edb2d4213a789d9bdfbf54be1d2ac
        <div
          className={`absolute bottom-0 ${
            isUser
              ? "right-0 translate-x-1/2 translate-y-1/2"
              : "left-0 -translate-x-1/2 translate-y-1/2"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full border-2 ${
<<<<<<< HEAD
              isUser
                ? isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
                : "bg-blue-600 border-white"
=======
              isUser ? "bg-white border-gray-100" : "bg-blue-600 border-white"
>>>>>>> a89900a86c9edb2d4213a789d9bdfbf54be1d2ac
            } flex items-center justify-center shadow-sm`}
          >
            {isUser ? (
              <Avatar className="h-7 w-7">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <BotIcon className="h-5 w-5 text-white" />
            )}
          </div>
        </div>
      </div>
<<<<<<< HEAD
    </motion.div>
=======
    </div>
>>>>>>> a89900a86c9edb2d4213a789d9bdfbf54be1d2ac
  );
}
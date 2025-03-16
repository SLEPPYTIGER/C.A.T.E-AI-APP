"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import { BotIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MessageBubbleProps {
  content: string;
  isUser?: boolean;
  className?: string;
}

const formatMessage = (content: string): string => {
  // First unescape backslashes
  content = content.replace(/\\\\/g, "\\");

  // Then handle newlines
  content = content.replace(/\\n/g, "\n");

  // Remove only the markers but keep the content between them
  content = content.replace(/---START---\n?/g, "").replace(/\n?---END---/g, "");

  // Format bullet points and lists
  content = content.replace(/^[-*•]\s+/gm, '• ');
  content = content.replace(/^\d+\.\s+/gm, (match) => `<span class="text-gray-500 mr-2">${match}</span>`);

  // Format code blocks that aren't terminal output
  if (!content.includes('<div class="bg-[#1e1e1e]')) {
    content = content.replace(/```([^`]+)```/g, '<pre class="bg-gray-100 text-gray-800 font-mono text-sm p-3 rounded-lg my-2 overflow-x-auto">$1</pre>');
  }

  // Format inline code
  content = content.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-gray-800 font-mono text-sm px-1.5 py-0.5 rounded">$1</code>');

  // Add spacing after terminal output
  if (content.includes('<div class="bg-[#1e1e1e]')) {
    content = content.replace('</div>', '</div><div class="mt-4"></div>');
  }

  // Trim any extra whitespace that might be left
  return content.trim();
};

const messageVariants = {
  hidden: (isUser: boolean) => ({
    opacity: 0,
    x: isUser ? 20 : -20,
    y: 10,
    scale: 0.95,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 25,
    }
  },
  exit: (isUser: boolean) => ({
    opacity: 0,
    x: isUser ? 20 : -20,
    scale: 0.95,
    transition: {
      duration: 0.2,
    }
  })
};

export function MessageBubble({ content, isUser, className }: MessageBubbleProps) {
  const { user } = useUser();

  return (
    <motion.div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={messageVariants}
      custom={isUser}
      layout
    >
      <motion.div
        className={cn(
          `rounded-2xl px-4 py-2.5 max-w-[85%] md:max-w-[75%] shadow-sm ring-1 ring-inset relative`,
          isUser
            ? "bg-blue-600 text-white rounded-br-none ring-blue-700"
            : "bg-white text-gray-900 rounded-bl-none ring-gray-200",
          className
        )}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <div className="relative">
          {/* Terminal output */}
          {content.includes('<div class="bg-[#1e1e1e]') ? (
            <div className="font-mono text-[14px] leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: formatMessage(content) }} />
            </div>
          ) : (
            /* Regular message */
            <div className="whitespace-pre-wrap text-[15px] leading-relaxed">
              <div 
                className={cn(
                  "space-y-2",
                  !isUser && "[&_ul]:mt-2 [&_ul]:space-y-1.5",
                  !isUser && "[&_ol]:mt-2 [&_ol]:space-y-1.5",
                  !isUser && "[&_li]:pl-4",
                  !isUser && "[&_p]:text-gray-700 [&_p]:mb-4",
                  !isUser && "[&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:mb-2",
                  !isUser && "[&_h3]:text-base [&_h3]:font-medium [&_h3]:text-gray-900 [&_h3]:mb-1"
                )}
                dangerouslySetInnerHTML={{ 
                  __html: formatMessage(content)
                }} 
              />
            </div>
          )}
        </div>

        {/* Avatar section */}
        <motion.div
          className={`absolute bottom-0 ${
            isUser
              ? "right-0 translate-x-1/2 translate-y-1/2"
              : "left-0 -translate-x-1/2 translate-y-1/2"
          }`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
        >
          <div
            className={`w-8 h-8 rounded-full border-2 ${
              isUser ? "bg-white border-gray-100" : "bg-blue-600 border-white"
            } flex items-center justify-center shadow-sm`}
          >
            {isUser ? (
              <Avatar className="h-7 w-7">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback className="font-medium">
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              >
                <BotIcon className="h-5 w-5 text-white" />
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
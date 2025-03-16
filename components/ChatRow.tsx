import { Doc, Id } from "@/convex/_generated/dataModel";
import { NavigationContext } from "@/lib/NavigationProvider";
import { useRouter } from "next/navigation";
import { use } from "react";
import { Button } from "./ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { MessageSquare, Trash2, Clock } from "lucide-react";

function formatTimeAgo(timestamp: number) {
    const now = Date.now();
    const seconds = Math.floor((now - timestamp) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days}d ago`;
    } else if (hours > 0) {
        return `${hours}h ago`;
    } else if (minutes > 0) {
        return `${minutes}m ago`;
    } else {
        return 'just now';
    }
}

function ChatRow({
    chat,
    onDelete,
}: {
    chat: Doc<"chats">;
    onDelete: (id: Id<"chats">) => void;
}) { 
    const router = useRouter();
    const { closeMobileNav } = use(NavigationContext);
    const lastMessage = useQuery(api.messages.getLastMessage, {
        chatId: chat._id,
    });

    const handleClick = () => {
        router.push(`/dashboard/chat/${chat._id}`);
        closeMobileNav();
    };
    
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="group relative rounded-xl border border-gray-200/30 bg-gradient-to-br from-white via-white to-gray-50/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md overflow-hidden"
            onClick={handleClick}
        >
            {/* Hover Gradient Effect */}
            <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            />

            {/* Shimmer effect */}
            <motion.div
                className="absolute inset-0 w-[200%] translate-x-[-50%] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
                animate={{
                    translateX: ["0%", "100%"],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "linear",
                    repeatDelay: 5
                }}
            />

            <div className="p-4 relative">
                <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <motion.div
                            whileHover={{ rotate: 15, scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400 }}
                            className="flex-shrink-0"
                        >
                            <MessageSquare className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600 truncate font-medium">
                                {lastMessage ? (
                                    <>
                                        <span className="font-semibold">
                                            {lastMessage.role === "user" ? "You: " : "AI: "}
                                        </span>
                                        {lastMessage.content.replace(/\\n/g, "\n")}
                                    </>
                                ) : (
                                    <span className="text-gray-400">New conversation</span>
                                )}
                            </p>
                            {lastMessage && (
                                <div className="flex items-center gap-1.5 mt-1">
                                    <Clock className="h-3 w-3 text-gray-400" />
                                    <p className="text-xs text-gray-400 font-medium tracking-wide">
                                        {formatTimeAgo(lastMessage.createdAt)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 -mr-2 -mt-2 ml-2 transition-all duration-300 hover:bg-red-50"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(chat._id);
                            }}
                        >
                            <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors duration-300" />
                        </Button>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

export default ChatRow;
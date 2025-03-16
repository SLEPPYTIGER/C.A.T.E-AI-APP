import { Doc, Id } from "@/convex/_generated/dataModel";
import { NavigationContext } from "@/lib/NavigationProvider";
import { useRouter } from "next/navigation";
import { use } from "react";
import { Button } from "./ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import TimeAgo from 'react-timeago';
import { motion } from "framer-motion";
import { MessageSquare, Trash2, Clock } from "lucide-react";

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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ scale: 1.02 }}
            className="group rounded-xl border border-gray-200/30 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md relative overflow-hidden"
            onClick={handleClick}
        >
            {/* Hover Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300" />

            <div className="p-4 relative">
                <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <motion.div
                            whileHover={{ rotate: 15 }}
                            className="flex-shrink-0"
                        >
                            <MessageSquare className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600 truncate font-medium">
                                {lastMessage ? (
                                    <>
                                        {lastMessage.role === "user" ? "You: " : "AI: "}
                                        {lastMessage.content.replace(/\\n/g, "\n")}
                                    </>
                                ) : (
                                    <span className="text-gray-400">New conversation</span>
                                )}
                            </p>
                            {lastMessage && (
                                <div className="flex items-center gap-1.5 mt-1">
                                    <Clock className="h-3 w-3 text-gray-400" />
                                    <p className="text-xs text-gray-400 font-medium">
                                        <TimeAgo date={lastMessage.createdAt} />
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 -mr-2 -mt-2 ml-2 transition-all duration-200 hover:bg-red-50"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(chat._id);
                            }}
                        >
                            <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors" />
                        </Button>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

export default ChatRow;
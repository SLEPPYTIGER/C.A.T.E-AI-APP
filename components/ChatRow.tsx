import { Doc, Id } from "@/convex/_generated/dataModel";
import { NavigationContext } from "@/lib/NavigationProvider";
import { ChatBubbleIcon, TrashIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { Button } from "./ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import TimeAgo from 'react-timeago';
import { cn } from "@/lib/utils";

function ChatRow({
    chat,
    onDelete,
}: {
    chat: Doc<"chats">;
    onDelete: (id: Id<"chats">) => void;
}) {
    const router = useRouter();
    const { closeMobileNav, isSidebarVisible, setRecentChatId } = useContext(NavigationContext);
    const lastMessage = useQuery(api.messages.getLastMessage, {
        chatId: chat._id,
    });

    const handleClick = () => {
        router.push(`/dashboard/chat/${chat._id}`);
        setRecentChatId(chat._id);
        closeMobileNav();
    };
    
    return (
        <div
          className={cn(
            "group rounded-xl border border-gray-200/30 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md",
            !isSidebarVisible && "p-2"
          )}
          onClick={handleClick}
          title={isSidebarVisible ? undefined : "Chat"}
        >
          {isSidebarVisible ? (
            <div className="p-4">
              <div className="flex justify-between items-start">
                <p className="text-sm text-gray-600 truncate flex-1 font-medium">
                  {lastMessage ? (
                    <>
                      {lastMessage.role === "user" ? "You: " : "AI: "}
                      {lastMessage.content.replace(/\\n/g, "\n")}
                    </>
                  ) : (
                    <span className="text-gray-400">New conversation</span>
                  )}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 -mr-2 -mt-2 ml-2 transition-opacity duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(chat._id);
                  }}
                >
                  <TrashIcon className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors" />
                </Button>
              </div>

              {lastMessage && (
                <p className="text-xs text-gray-400 mt-1.5 font-medium">
                  <TimeAgo date={lastMessage.createdAt} />
                </p>
              )}
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-6 h-6 text-gray-500">
                <ChatBubbleIcon className="w-full h-full" />
              </div>
            </div>
          )}
        </div>
    );
}

export default ChatRow;
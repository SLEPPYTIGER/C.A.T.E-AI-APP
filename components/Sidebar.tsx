"use client";

import { NavigationContext } from "@/lib/NavigationProvider";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, BookmarkIcon, Half2Icon, Half1Icon } from "@radix-ui/react-icons";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import ChatRow from "./ChatRow";

function Sidebar() {
  const router = useRouter();
  const { closeMobileNav, isMobileNavOpen, isSidebarVisible, toggleSidebar, isDarkMode, toggleDarkMode, recentChatId } = useContext(NavigationContext);
  const chats = useQuery(api.chats.listChats);
  const createChat = useMutation(api.chats.createChat);
  const deleteChat = useMutation(api.chats.deleteChat);
  const [showRecentOnly, setShowRecentOnly] = useState(false);

  // Sort chats with the most recently selected chat at the top
  const sortedChats = chats?.slice().sort((a, b) => {
    // If a chat matches the recentChatId, it should be first
    if (a._id === recentChatId) return -1;
    if (b._id === recentChatId) return 1;
    
    // Otherwise sort by creation time (newest first)
    return b.createdAt - a.createdAt;
  });

  const filteredChats = showRecentOnly
    ? sortedChats?.slice(0, 5)
    : sortedChats;

  const handleNewChat = async () => {
    const chatId = await createChat({ title: "New Chat" });
    router.push(`/dashboard/chat/${chatId}`);
    closeMobileNav();
  };

  const handleDeleteChat = async (id: Id<"chats">) => {
    await deleteChat({ id });
    if (window.location.pathname.includes(id)) {
      router.push("/dashboard");
    }
  };


  return (
    <>
      {/* Background Overlay for mobile */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={closeMobileNav}
        />
      )}
      <div
        className={cn(
          "fixed md:inset-y-0 top-14 bottom-0 left-0 z-50 bg-gray-50/80 dark:bg-[#1A1A1A]/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 transform transition-all duration-300 ease-in-out md:relative md:translate-x-0 md:top-0 flex",
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full",
          isSidebarVisible ? "w-72" : "w-12"
        )}
      >
        {/* Main Sidebar Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50 space-y-4">
            <Button
              onClick={handleNewChat}
              className={cn(
                "new-chat-button bg-white dark:bg-[#2A2A2A] hover:bg-gray-50 dark:hover:bg-[#3A3A3A] text-gray-700 dark:text-[#D4D4D4] border border-gray-200/50 dark:border-gray-600/50 shadow-sm hover:shadow transition-all duration-200",
                isSidebarVisible ? "w-full" : "w-8 h-8 p-0"
              )}
              title="New Chat"
            >
              <PlusIcon className={cn("h-4 w-4", isSidebarVisible && "mr-2")} />
              {isSidebarVisible && "New Chat"}
            </Button>

            {/* Quick Actions Panel */}
            {isSidebarVisible && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700 dark:text-[#D4D4D4] mb-2">Quick Actions</div>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => setShowRecentOnly(!showRecentOnly)}
                    className={cn(
                      "w-full text-gray-700 dark:text-[#D4D4D4] border border-gray-200/50 dark:border-gray-600/50 shadow-sm justify-start",
                      showRecentOnly
                        ? "bg-blue-50 hover:bg-blue-100 dark:bg-[#4A90E2]/20 dark:hover:bg-[#4A90E2]/30"
                        : "bg-white hover:bg-gray-50 dark:bg-[#2A2A2A] dark:hover:bg-[#3A3A3A]"
                    )}
                  >
                    <BookmarkIcon className="h-4 w-4 mr-2" />
                    {showRecentOnly ? "Show All Chats" : "Show Recent Chats"}
                  </Button>
                  <Button
                    onClick={toggleDarkMode}
                    className="w-full bg-white dark:bg-[#2A2A2A] hover:bg-gray-50 dark:hover:bg-[#3A3A3A] text-gray-700 dark:text-[#D4D4D4] border border-gray-200/50 dark:border-gray-600/50 shadow-sm hover:shadow justify-start"
                  >
                    {isDarkMode ? (
                      <Half1Icon className="h-4 w-4 mr-2" />
                    ) : (
                      <Half2Icon className="h-4 w-4 mr-2" />
                    )}
                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 p-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {filteredChats?.map((chat) => (
              <ChatRow key={chat._id} chat={chat} onDelete={handleDeleteChat} />
            ))}
            {isSidebarVisible && filteredChats?.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                {showRecentOnly ? "No recent chats" : "No chats yet"}
              </div>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-[#2A2A2A] p-1 rounded-full border border-gray-200/50 dark:border-gray-600/50 shadow-sm hover:shadow transition-all duration-200 z-50"
        >
          {isSidebarVisible ? (
            <ChevronLeftIcon className="h-4 w-4 text-gray-600 dark:text-[#D4D4D4]" />
          ) : (
            <ChevronRightIcon className="h-4 w-4 text-gray-600 dark:text-[#D4D4D4]" />
          )}
        </button>
      </div>
    </>
  );
}

export default Sidebar;
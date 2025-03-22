import { NavigationContext } from "@/lib/NavigationProvider";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon, PlusIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import ChatRow from "./ChatRow";

function Sidebar() {
  const router = useRouter();
  const { closeMobileNav, isMobileNavOpen, isSidebarVisible, toggleSidebar } = useContext(NavigationContext);
  const [searchQuery, setSearchQuery] = useState("");
  const chats = useQuery(api.chats.listChats);
  const createChat = useMutation(api.chats.createChat);
  const deleteChat = useMutation(api.chats.deleteChat);

  const filteredChats = chats?.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewChat = async () => {
    const chatId = await createChat({ title: "New Chat" });
    router.push(`/dashboard/chat/${chatId}`);
    closeMobileNav();
  };

  const handleDeleteChat = async (id: Id<"chats">) => {
    await deleteChat({ id });
    // If we're currently viewing this chat, redirect to dashboard
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
          "fixed md:inset-y-0 top-14 bottom-0 left-0 z-50 bg-gray-50/80 backdrop-blur-xl border-r border-gray-200/50 transform transition-all duration-300 ease-in-out md:relative md:translate-x-0 md:top-0 flex",
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full",
          isSidebarVisible ? "w-72" : "w-12"
        )}
      >
        {/* Main Sidebar Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="p-4 border-b border-gray-200/50 space-y-4">
            <Button
              onClick={handleNewChat}
              className={cn(
                "new-chat-button bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/50 shadow-sm hover:shadow transition-all duration-200",
                isSidebarVisible ? "w-full" : "w-8 h-8 p-0"
              )}
              title="New Chat"
            >
              <PlusIcon className={cn("h-4 w-4", isSidebarVisible && "mr-2")} />
              {isSidebarVisible && "New Chat"}
            </Button>
            
            {/* Search Input */}
            {isSidebarVisible && (
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input w-full pl-9 pr-4 py-2 bg-white border border-gray-200/50 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2.5 p-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {(searchQuery ? filteredChats : chats)?.map((chat) => (
              <ChatRow key={chat._id} chat={chat} onDelete={handleDeleteChat} />
            ))}
            {searchQuery && filteredChats?.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No chats found matching &ldquo;{searchQuery}&rdquo;
              </div>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white p-1 rounded-full border border-gray-200/50 shadow-sm hover:shadow transition-all duration-200 z-50"
        >
          {isSidebarVisible ? (
            <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronRightIcon className="h-4 w-4 text-gray-600" />
          )}
        </button>
      </div>
    </>
  );
}

export default Sidebar;
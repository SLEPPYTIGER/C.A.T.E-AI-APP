import { NavigationContext } from "@/lib/NavigationProvider";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { Button } from "./ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import ChatRow from "./ChatRow";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquarePlus, Sparkles, Settings, Command, Home, X } from "lucide-react";
import Link from "next/link";

function Sidebar() {
  const router = useRouter();
  const { closeMobileNav, isMobileNavOpen } = use(NavigationContext);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const chats = useQuery(api.chats.listChats);
  const createChat = useMutation(api.chats.createChat);
  const deleteChat = useMutation(api.chats.deleteChat);

  const handleNewChat = async () => {
    setActiveTooltip(null);
    const chatId = await createChat({ title: "New Chat" });
    router.push(`/dashboard/chat/${chatId}`);
    closeMobileNav();
  };

  const handleDeleteChat = async (id: Id<"chats">) => {
    setActiveTooltip(null);
    await deleteChat({ id });
    if (window.location.pathname.includes(id)) {
      router.push("/dashboard");
    }
  };

  const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300 }
    }
  };

  const tooltipContent = {
    commands: (
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">Available Commands</span>
          <div
            onClick={() => setActiveTooltip(null)}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </div>
        </div>
        <div className="space-y-1.5 text-sm">
          <p className="flex items-center gap-2">
            <span className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">/help</span>
            <span className="text-gray-600">Show all commands</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">/search</span>
            <span className="text-gray-600">Search in conversation</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">/clear</span>
            <span className="text-gray-600">Clear conversation</span>
          </p>
        </div>
      </div>
    ),
    features: (
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">AI Capabilities</span>
          <div
            onClick={() => setActiveTooltip(null)}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </div>
        </div>
        <div className="space-y-1.5 text-xs text-gray-600">
          <p>• Process and analyze data</p>
          <p>• Execute system commands</p>
          <p>• Create and modify files</p>
          <p>• Integrate with external tools</p>
          <p>• Handle multiple chat contexts</p>
        </div>
      </div>
    ),
    settings: (
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">AI Preferences</span>
          <div
            onClick={() => setActiveTooltip(null)}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </div>
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-gray-600">
            <span>Response Length</span>
            <span className="bg-blue-100 text-blue-700 px-1.5 rounded">Detailed</span>
          </div>
          <div className="flex items-center justify-between text-gray-600">
            <span>Code Style</span>
            <span className="bg-purple-100 text-purple-700 px-1.5 rounded">Modern</span>
          </div>
          <div className="flex items-center justify-between text-gray-600">
            <span>AI Model</span>
            <span className="bg-green-100 text-green-700 px-1.5 rounded">Latest</span>
          </div>
        </div>
      </div>
    )
  };

  return (
    <>
      <AnimatePresence>
        {isMobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm"
            onClick={closeMobileNav}
          />
        )}
      </AnimatePresence>

      <motion.div
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          "fixed md:inset-y-0 top-14 bottom-0 left-0 z-50 w-72 bg-gradient-to-b from-white to-gray-50/90 backdrop-blur-xl border-r border-gray-200/50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:top-0 flex flex-col",
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Top Section with Glow Effect */}
        <motion.div 
          variants={itemVariants}
          className="p-4 border-b border-gray-200/50 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-gradient-slow" />
          <div className="relative">
            <Button
              onClick={handleNewChat}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="mr-2"
              >
                <MessageSquarePlus className="h-4 w-4 text-blue-500 group-hover:text-blue-600" />
              </motion.div>
              New Chat
            </Button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          variants={itemVariants}
          className="px-3 py-2 border-b border-gray-200/50"
        >
          <div className="flex items-center justify-around pb-6 relative">
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-colors group relative"
                onClick={() => {
                  setActiveTooltip(null);
                  closeMobileNav();
                }}
              >
                <Home className="h-5 w-5" />
                <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Dashboard
                </span>
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors group relative"
              onClick={() => setActiveTooltip(activeTooltip === 'commands' ? null : 'commands')}
            >
              <Command className="h-5 w-5" />
              <AnimatePresence>
                {activeTooltip === 'commands' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg ring-1 ring-gray-200 z-50 min-w-[200px]"
                  >
                    {tooltipContent.commands}
                  </motion.div>
                ) : (
                  <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Commands
                  </span>
                )}
              </AnimatePresence>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors group relative"
              onClick={() => setActiveTooltip(activeTooltip === 'features' ? null : 'features')}
            >
              <Sparkles className="h-5 w-5" />
              <AnimatePresence>
                {activeTooltip === 'features' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg ring-1 ring-gray-200 z-50 min-w-[200px]"
                  >
                    {tooltipContent.features}
                  </motion.div>
                ) : (
                  <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Features
                  </span>
                )}
              </AnimatePresence>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors group relative"
              onClick={() => setActiveTooltip(activeTooltip === 'settings' ? null : 'settings')}
            >
              <Settings className="h-5 w-5" />
              <AnimatePresence>
                {activeTooltip === 'settings' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg ring-1 ring-gray-200 z-50 min-w-[200px]"
                  >
                    {tooltipContent.settings}
                  </motion.div>
                ) : (
                  <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Settings
                  </span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>

        {/* Chat List with Scroll Animation */}
        <motion.div 
          variants={itemVariants}
          className="flex-1 overflow-y-auto space-y-2.5 p-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
        >
          <AnimatePresence>
            {chats?.map((chat, index) => (
              <motion.div
                key={chat._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveTooltip(null)}
              >
                <ChatRow chat={chat} onDelete={handleDeleteChat} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Gradient Border */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200/50 to-transparent" />
      </motion.div>
    </>
  );
}

export default Sidebar;
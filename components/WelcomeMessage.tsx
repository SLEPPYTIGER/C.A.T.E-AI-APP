"use client";

import { motion } from "framer-motion";
import { Bot, Youtube, BookOpen, FileJson, Database, MessageSquare, XCircle, CheckCircle, BrainCircuit, Code, Globe, Lock } from "lucide-react";
import { useContext } from "react";
import { NavigationContext } from "@/lib/NavigationProvider";

const capabilities = [
  {
    icon: Youtube,
    text: "Find and analyze YouTube video transcripts",
    description: "Extract insights from video content"
  },
  {
    icon: BookOpen,
    text: "Search through Google Books",
    description: "Access vast library of book content"
  },
  {
    icon: FileJson,
    text: "Process data with JSONata",
    description: "Transform and query JSON data"
  },
  {
    icon: Database,
    text: "Retrieve Mathematic Calculation",
    description: "Access Wolfram"
  },
  {
    icon: MessageSquare,
    text: "Fetch Comments API data",
    description: "Analyze user feedback"
  },
  {
    icon: Code,
    text: "Execute system commands",
    description: "Run CLI operations safely"
  }
];

const limitations = [
  {
    icon: Globe,
    text: "Cannot browse the internet freely",
  },
  {
    icon: Lock,
    text: "Cannot access private or secure data",
  },
  {
    icon: BrainCircuit,
    text: "Cannot learn from conversations",
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function WelcomeMessage() {
  const { isDarkMode } = useContext(NavigationContext);
  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-full mt-10 px-4"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.div
        className={`rounded-2xl shadow-lg ring-1 ring-inset p-6 max-w-2xl w-full relative overflow-hidden ${
          isDarkMode
            ? "bg-gray-800 ring-gray-700"
            : "bg-white ring-gray-200"
        }`}
        variants={itemVariants}
      >
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br opacity-50 ${
          isDarkMode
            ? "from-blue-900/20 via-purple-900/20 to-blue-900/20"
            : "from-blue-50 via-purple-50 to-blue-50"
        }`} />
        
        {/* Content */}
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
            >
              <Bot className={`w-8 h-8 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
            </motion.div>
            <div>
              <motion.h2
                className={`text-2xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}
                variants={itemVariants}
              >
                Welcome to C.A.T.E AI Agent
              </motion.h2>
              <motion.p
                className={`mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                variants={itemVariants}
              >
                Your intelligent assistant powered by advanced AI
              </motion.p>
            </div>
          </div>

          {/* Capabilities */}
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h3 className={`text-lg font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>Capabilities</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {capabilities.map((capability, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-xl transition-colors group ${
                      isDarkMode
                        ? "bg-gray-700/50 hover:bg-gray-700"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    variants={itemVariants}
                  >
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      className="mt-1"
                    >
                      <capability.icon className={`w-5 h-5 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
                    </motion.div>
                    <div>
                      <p className={`font-medium transition-colors ${
                        isDarkMode
                          ? "text-gray-300 group-hover:text-gray-100"
                          : "text-gray-700 group-hover:text-gray-900"
                      }`}>
                        {capability.text}
                      </p>
                      <p className={`text-sm mt-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {capability.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Limitations */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-5 h-5 text-red-500" />
                <h3 className={`text-lg font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>Limitations</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {limitations.map((limitation, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-center gap-2 p-2 rounded-lg ${
                      isDarkMode
                        ? "bg-red-900/20 text-red-300"
                        : "bg-red-50 text-red-900"
                    }`}
                    variants={itemVariants}
                  >
                    <limitation.icon className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? "text-red-400" : "text-red-500"}`} />
                    <p className="text-sm">{limitation.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Start Message */}
          <motion.div 
            className={`mt-6 p-4 rounded-xl border ${
              isDarkMode
                ? "bg-blue-900/20 border-blue-800/30"
                : "bg-blue-50 border-blue-100"
            }`}
            variants={itemVariants}
          >
            <p className={`text-center ${isDarkMode ? "text-blue-300" : "text-blue-700"}`}>
              Start by typing your message below. I&apos;m here to assist you!
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
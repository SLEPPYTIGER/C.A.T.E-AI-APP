"use client";

import { BotIcon, Sparkles, Zap, Wrench } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

const features = [
  {
    icon: Zap,
    text: "Real-time responses",
    color: "bg-blue-500",
    delay: 0.2
  },
  {
    icon: Sparkles,
    text: "Smart assistance",
    color: "bg-green-500",
    delay: 0.3
  },
  {
    icon: Wrench,
    text: "Powerful tools",
    color: "bg-purple-500",
    delay: 0.4
  }
];

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 min-h-[80vh] relative overflow-hidden" suppressHydrationWarning>
      {/* Animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#ffffff,#f3f4f6_40%,#e5e7eb_80%)] opacity-70" />
      
      {/* Animated grid with blur effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 -left-20 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div className="absolute -bottom-8 left-1/3 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute top-1/3 -right-20 w-40 h-40 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

      <motion.div 
        className="relative max-w-2xl w-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="relative space-y-6 p-8"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div 
            className="bg-white/80 backdrop-blur-xl shadow-2xl ring-1 ring-gray-200/50 rounded-2xl p-8 space-y-6"
            initial={{ rotateX: -20 }}
            animate={{ rotateX: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="relative group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-200" />
              <div className="relative bg-gradient-to-b from-white to-gray-50 rounded-xl p-4 flex items-center justify-center">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <BotIcon className="w-16 h-16 text-gray-700" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4 text-center"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                Welcome to the AI Agent Chat
              </h2>
              <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
                Start a new conversation or select an existing chat from the
                sidebar. Your AI assistant is ready to help with any task.
              </p>
            </motion.div>

            <motion.div 
              className="pt-4 flex justify-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {features.map((feature) => (
                <motion.div
                  key={feature.text}
                  className="group relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: feature.delay }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                      <div className={`w-3 h-3 rounded-full ${feature.color} animate-ping absolute inset-0`} />
                      <div className={`w-3 h-3 rounded-full ${feature.color} relative`} />
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <feature.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{feature.text}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
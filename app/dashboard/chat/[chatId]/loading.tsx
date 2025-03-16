"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function Loading() {
  // Generate random number between 2 and 6
  const numMessages = Math.floor(Math.random() * 5) + 2;

  // Floating particles configuration
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 5,
  }));

  return (
    <div className="flex-1 overflow-hidden bg-gradient-to-b from-gray-50 to-white relative">
      {/* Animated background particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-blue-200/20"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: ["0%", "-100%"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* Messages section */}
      <div className="h-[calc(100vh-65px)] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <AnimatePresence>
              {[...Array(numMessages)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"} items-end gap-3`}
                >
                  {/* Avatar placeholder */}
                  {i % 2 === 0 ? (
                    <motion.div
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-500"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  ) : (
                    <motion.div
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                  )}

                  {/* Message bubble */}
                  <div
                    className={`w-2/3 rounded-2xl p-6 relative overflow-hidden ${
                      i % 2 === 0
                        ? "bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-br-none"
                        : "bg-white rounded-bl-none border border-gray-200/50 shadow-sm"
                    }`}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    <div className="space-y-3 relative">
                      <motion.div
                        className={`h-4 rounded-full w-[90%] ${
                          i % 2 === 0 ? "bg-white/30" : "bg-gray-200"
                        }`}
                        animate={{ opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.div
                        className={`h-4 rounded-full w-[75%] ${
                          i % 2 === 0 ? "bg-white/30" : "bg-gray-200"
                        }`}
                        animate={{ opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                      />
                      <motion.div
                        className={`h-4 rounded-full w-[60%] ${
                          i % 2 === 0 ? "bg-white/30" : "bg-gray-200"
                        }`}
                        animate={{ opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Input section */}
        <div className="border-t bg-white/80 backdrop-blur-sm p-4">
          <div className="max-w-4xl mx-auto relative">
            <motion.div
              className="h-12 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded-full overflow-hidden"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* Animated typing dots */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-blue-500"
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
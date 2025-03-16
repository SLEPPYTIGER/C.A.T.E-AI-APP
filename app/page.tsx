"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ArrowRight, Sparkles, Zap, Brain } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

const features = [
  { 
    title: "Fast", 
    description: "Real-time streamed responses",
    icon: Zap,
    color: "bg-blue-500"
  },
  {
    title: "Modern",
    description: "Next.js 15, Tailwind CSS, Convex, Clerk",
    icon: Sparkles,
    color: "bg-green-500"
  },
  { 
    title: "Smart", 
    description: "Powered by Your Favourite LLM's",
    icon: Brain,
    color: "bg-purple-500"
  },
];

const terminalLines = [
  "$ Initializing AI system...",
  "$ Loading language models...",
  "$ Connecting to WxTools...",
  "$ System ready!"
];

export default function LandingPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
      setCurrentLine(prev => (prev < terminalLines.length - 1 ? prev + 1 : prev));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#ffffff,#f3f4f6_40%,#e5e7eb_80%)] opacity-70" />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 -left-20 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div className="absolute -bottom-8 left-1/3 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute top-1/3 -right-20 w-40 h-40 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

      <section className="relative w-full px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 min-h-screen flex flex-col justify-center items-center space-y-16">
        {/* Hero content */}
        <motion.header 
          className="space-y-8 text-center relative w-full max-w-3xl mx-auto"
          initial="initial"
          animate="animate"
          variants={{
            initial: { opacity: 0, y: 30 },
            animate: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.h1 
              className="text-6xl font-bold tracking-tight sm:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 pb-2"
              animate={{ 
                backgroundPosition: ["0%", "100%"],
                scale: [1, 1.02, 1],
                rotate: [0, 1, -1, 0]
              }}
              transition={{ 
                backgroundPosition: { duration: 8, repeat: Infinity, repeatType: "reverse" },
                scale: { duration: 2, repeat: Infinity, repeatType: "reverse" },
                rotate: { duration: 4, repeat: Infinity, repeatType: "reverse" }
              }}
            >
              C.A.T.E-AI-SAAS
            </motion.h1>
          </motion.div>

          <motion.div 
            className="max-w-2xl mx-auto text-center"
            variants={fadeInUp}
          >
            <p className="text-xl text-gray-700 md:text-2xl/relaxed">
              Meet your new AI chat companion that goes beyond conversation - it
              can actually get things done!
            </p>
            <p className="text-gray-600 text-base mt-2">
              Powered by IBM&apos;s WxTools & your favourite LLM&apos;s.
            </p>
          </motion.div>
        </motion.header>

        {/* Terminal Animation */}
        <motion.div
          className="w-full max-w-2xl mx-auto bg-gray-900 rounded-xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-800">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="p-6 font-mono text-sm text-green-400">
            {terminalLines.slice(0, currentLine + 1).map((line, index) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.5 }}
                className="py-1"
              >
                {line}
              </motion.div>
            ))}
            <motion.span
              animate={{ opacity: [0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-2 h-4 bg-green-400 ml-1"
            />
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center"
        >
          <SignedIn>
            <Link href="/dashboard">
              <motion.button 
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="relative z-10 flex items-center">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              </motion.button>
            </Link>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <motion.button 
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="relative z-10 flex items-center">
                  Sign Up
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              </motion.button>
            </SignInButton>
          </SignedOut>
        </motion.div>

        {/* Features grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mx-auto px-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {features.map(({ title, description, icon: Icon, color }, index) => (
            <motion.div
              key={title}
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
              whileHover={{ y: -5 }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-lg border border-gray-100 transition-all duration-300">
                <div className="flex flex-col items-center justify-center text-center h-full">
                  <div className="relative mb-4">
                    <div className={`w-3 h-3 rounded-full ${color} animate-ping absolute inset-0`} />
                    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center relative`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-600">{description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}
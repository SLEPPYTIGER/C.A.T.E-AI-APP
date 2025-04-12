"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ArrowRight, Sparkles, Zap, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const features = [
  {
    title: "Fast",
    description: "Real-time streamed responses",
    icon: Zap,
    color: "bg-blue-400",
  },
  {
    title: "Modern",
    description: "Next.js 15, Tailwind CSS, Convex, Clerk",
    icon: Sparkles,
    color: "bg-emerald-400",
  },
  {
    title: "Smart",
    description: "Powered by Your Favourite LLM&apos;s",
    icon: Brain,
    color: "bg-violet-400",
  },
];

const terminalLines = [
  "$ Initializing AI system...",
  "$ Loading language models...",
  "$ Connecting to WxTools...",
  "$ System ready!",
];

export default function LandingPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
      setCurrentLine((prev) => (prev < terminalLines.length - 1 ? prev + 1 : prev));
    }, 800);
    return () => clearInterval(timer);
  }, []);

  const handleStartTutorial = () => {
    router.push("/dashboard");
  };

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#f0f4f8_0%,#ffffff_70%)] opacity-50 animate-pulse-slow" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] opacity-10" />

      {/* Floating particles */}
      <motion.div
        className="absolute top-20 left-1/4 w-24 h-24 bg-blue-100 rounded-full mix-blend-overlay blur-2xl opacity-60"
        animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-1/3 w-32 h-32 bg-emerald-100 rounded-full mix-blend-overlay blur-2xl opacity-60"
        animate={{ y: [0, 20, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <section className="relative w-full px-6 py-16 mx-auto max-w-7xl min-h-screen flex flex-col justify-center items-center space-y-12">
        {/* Hero Section */}
        <motion.header
          className="hero-section space-y-6 text-center relative w-full max-w-4xl"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.h1
            className="text-5xl sm:text-7xl font-extrabold tracking-tight text-gray-900"
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <span className="relative inline-block">
              C.A.T.E-AI-SAAS
              <motion.span
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-violet-400 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </span>
          </motion.h1>

          <motion.div className="max-w-2xl mx-auto space-y-2" variants={fadeInUp}>
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
              Meet your new AI chat companion that goes beyond conversation—it gets things done!
            </p>
            <p className="text-sm text-gray-500">
              Powered by IBM&apos;s WxTools & your favorite LLMs.
            </p>
          </motion.div>
        </motion.header>

        {/* Terminal Animation */}
        <motion.div
          className="terminal-section w-full max-w-xl bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div className="p-5 font-mono text-sm text-gray-800">
            {terminalLines.slice(0, currentLine + 1).map((line, index) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.3 }}
                className="py-0.5"
              >
                {line}
              </motion.div>
            ))}
            <motion.span
              animate={{ opacity: [0, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-1.5 h-3 bg-gray-800 ml-1"
            />
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <SignedIn>
            <motion.button
              onClick={handleStartTutorial}
              className="group relative inline-flex items-center px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-violet-500 rounded-full shadow-md overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="relative z-10 flex items-center">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <motion.button
                className="group relative inline-flex items-center px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-violet-500 rounded-full shadow-md overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="relative z-10 flex items-center">
                  Sign Up
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </SignInButton>
          </SignedOut>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="features-section grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {features.map(({ title, description, icon: Icon, color }) => (
            <motion.div
              key={title}
              className="group relative bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              variants={fadeInUp}
              whileHover={{ y: -4 }}
            >
              <div className="flex flex-col items-center text-center">
                <motion.div
                  className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mb-4`}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 10s infinite ease-in-out;
        }
      `}</style>
    </main>
  );
}
"use client";

import { motion } from "framer-motion";
import { Bot, Clock, Lightbulb, Palette, Languages, Shield, ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  {
    icon: Bot,
    title: "Conversational Excellence",
    description: "Interact with an AI crafted to emulate human nuance, adapting seamlessly to your dialogue with precision and depth.",
    color: "from-blue-400 to-blue-600",
    accent: "bg-blue-500",
  },
  {
    icon: Clock,
    title: "Instant Precision",
    description: "Receive swift, accurate responses that enhance your efficiency, integrating effortlessly into your daily operations.",
    color: "from-teal-400 to-teal-600",
    accent: "bg-teal-500",
  },
  {
    icon: Lightbulb,
    title: "Insightful Innovation",
    description: "Ignite groundbreaking ideas with AI-generated insights, tailored to inspire and elevate your creative process.",
    color: "from-amber-400 to-amber-600",
    accent: "bg-amber-500",
  },
  {
    icon: Palette,
    title: "Customized Expression",
    description: "Define your AI’s voice and demeanor, aligning its character with your professional or personal identity.",
    color: "from-pink-400 to-pink-600",
    accent: "bg-pink-500",
  },
  {
    icon: Languages,
    title: "Global Fluency",
    description: "Communicate effortlessly worldwide with sophisticated multilingual capabilities, transcending linguistic boundaries.",
    color: "from-cyan-400 to-cyan-600",
    accent: "bg-cyan-500",
  },
  {
    icon: Shield,
    title: "Uncompromised Security",
    description: "Protect your interactions with robust encryption, ensuring privacy and trust in every exchange.",
    color: "from-gray-400 to-gray-600",
    accent: "bg-gray-500",
  },
];

const sectionVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const featureVariants = {
  hidden: { opacity: 0, y: 30, rotateX: -15 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

const avatarVariants = {
  animate: {
    y: [0, -20, 0],
    rotate: [0, 15, -15, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
};

const glowVariants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.2, 0.4, 0.2],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function Features() {
  return (
    <div className="h-screen bg-white relative overflow-hidden flex items-center justify-center px-6">
      {/* Subtle Animated Background Elements */}
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(45deg,#f3f4f6_25%,transparent_25%,transparent_75%,#f3f4f6_75%)] bg-[size:20px_20px] opacity-10"
        animate={{ rotate: [0, 5, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-10 left-10 w-48 h-48 bg-blue-100/20 rounded-full blur-2xl opacity-30"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center">
        {/* Floating Chatbot Avatar */}
        <motion.div
          className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg z-20"
          variants={avatarVariants}
          animate="animate"
          whileHover={{ scale: 1.15, rotate: 20 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Bot className="w-8 h-8 text-white" />
          <motion.div
            className="absolute -inset-2 bg-blue-400/30 rounded-full blur-xl"
            variants={glowVariants}
            animate="animate"
          />
        </motion.div>

        {/* Header Section - Centered */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 tracking-tight">
            Advanced AI Capabilities
          </h1>
          <p className="text-lg text-gray-600 max-w-md">
            Discover a sophisticated chatbot engineered for excellence and innovation.
          </p>
          <motion.div
            className="mt-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link href="/">
              <Button
                variant="ghost"
                className="text-gray-700 hover:bg-gray-100/50 rounded-full px-5 py-2 transition-all duration-300 shadow-sm"
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Return
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features - Compact Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
          variants={sectionVariants}
          initial="hidden"
          animate="show"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={featureVariants}
              whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)" }}
              className="flex flex-col items-center p-6 bg-white/95 backdrop-blur-sm rounded-xl border border-gray-200/30 relative overflow-hidden group"
            >
              {/* Icon with Glow */}
              <motion.div
                className={`w-12 h-12 ${feature.accent} rounded-full flex items-center justify-center shadow-md mb-4 relative`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <feature.icon className="w-6 h-6 text-white" />
                <motion.div
                  className={`absolute -inset-2 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-15 blur-md`}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center tracking-tight">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm text-center leading-relaxed">
                {feature.description}
              </p>

              {/* Subtle Hover Accent */}
              <motion.div
                className={`absolute bottom-0 left-0 w-full h-1 ${feature.accent} opacity-0 group-hover:opacity-100`}
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
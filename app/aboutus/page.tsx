"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react"; // Using Bot icon for the robot placeholder
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import Link from "next/link";

const teamMembers = [
  {
    name: "Dr. Sarah Chen",
    role: "AI Research Lead",
    description: "A visionary with a Ph.D. in Machine Learning, driving AI innovation with over a decade of expertise.",
    color: "from-blue-400 to-blue-600",
  },
  {
    name: "Michael Rodriguez",
    role: "Senior Developer",
    description: "A full-stack maestro architecting scalable, cutting-edge AI solutions.",
    color: "from-purple-400 to-purple-600",
  },
  {
    name: "Emma Thompson",
    role: "UX Director",
    description: "A design pioneer crafting seamless, intuitive interfaces for AI interactions.",
    color: "from-pink-400 to-pink-600",
  },
  {
    name: "James Wilson",
    role: "Technical Architect",
    description: "An engineering titan building robust frameworks for next-generation AI.",
    color: "from-green-400 to-green-600",
  },
];

const values = [
  {
    title: "Pioneering Innovation",
    description: "Relentlessly advancing AI to tackle the world’s most intricate challenges with bold, forward-thinking solutions.",
  },
  {
    title: "User-Focused Design",
    description: "Engineering experiences that prioritize elegance, accessibility, and user empowerment at every touchpoint.",
  },
  {
    title: "Ethical Integrity",
    description: "Upholding transparency and responsibility in AI development to foster trust and societal benefit.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, rotateX: -10 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

const robotVariants = {
  animate: {
    y: [0, -10, 0],
    rotate: [0, 2, -2, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden py-16 px-6 flex items-center justify-center">
      {/* Subtle Animated Background Elements */}
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(45deg,#f3f4f6_25%,transparent_25%,transparent_75%,#f3f4f6_75%)] bg-[size:20px_20px] opacity-10"
        animate={{ rotate: [0, 5, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-20 left-20 w-48 h-48 bg-blue-100/20 rounded-full blur-2xl opacity-30"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            About Our Vision
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We’re redefining AI to empower developers with tools that are intuitive, innovative, and impactful.
          </p>
          <motion.div
            className="mt-6"
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

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Huge Robot Placeholder */}
          <motion.div
            className="flex-1 flex justify-center"
            variants={robotVariants}
            animate="animate"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-72 h-72 md:w-96 md:h-96 bg-gray-200 rounded-xl flex items-center justify-center shadow-lg overflow-hidden relative">
              <Bot className="w-48 h-48 md:w-64 md:h-64 text-gray-400" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 opacity-0 hover:opacity-100"
                transition={{ duration: 0.4 }}
              />
            </div>
          </motion.div>

          {/* Team and Values */}
          <div className="flex-1 space-y-12">
            {/* Team Section */}
            <motion.div variants={containerVariants} initial="hidden" animate="show">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center lg:text-left">
                Our Esteemed Team
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {teamMembers.map((member) => (
                  <motion.div
                    key={member.name}
                    variants={itemVariants}
                    whileHover={{ scale: 1.03, boxShadow: "0 8px 16px rgba(0, 0, 0, 0.05)" }}
                    className="p-5 bg-white/95 backdrop-blur-sm rounded-xl border border-gray-200/30 group relative overflow-hidden"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-2">{member.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {member.description}
                    </p>
                    <motion.div
                      className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${member.color} opacity-0 group-hover:opacity-100`}
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Values Section */}
            <motion.div variants={containerVariants} initial="hidden" animate="show">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center lg:text-left">
                Our Core Principles
              </h2>
              <div className="space-y-4">
                {values.map((value) => (
                  <motion.div
                    key={value.title}
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                    className="p-4 bg-white/95 backdrop-blur-sm rounded-xl border border-gray-200/30"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
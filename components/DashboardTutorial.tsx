"use client";

import { motion } from "framer-motion";
import { Bot, MessageSquare, Search, Plus, ArrowRight, Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";

interface TutorialStep {
  title: string;
  description: string;
  element: string;
  icon: LucideIcon;
  spotlight: { size: number };
  zoom?: number;
  textOffset?: { x: number; y: number };
  robotAnimation?: {
    rotate?: number[];
    scale?: number[];
    y?: number[];
    transition?: {
      duration: number;
      repeat: number;
      ease: string;
    };
  };
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Welcome to Your Dashboard!",
    description: "Hi friend! Let me show you around your new AI workspace!",
    element: ".hero-section",
    icon: Bot,
    spotlight: { size: 400 },
    zoom: 1,
    textOffset: { x: 200, y: -100 },
    robotAnimation: {
      rotate: [0, 10, -10, 0],
      scale: [1, 1.1, 1],
      y: [0, -5, 0],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
  },
  {
    title: "Start a New Chat",
    description: "Click this button to start talking with me! I can help you learn and create amazing things!",
    element: ".new-chat-button",
    icon: Plus,
    spotlight: { size: 200 },
    zoom: 1.5,
    textOffset: { x: 150, y: 50 },
    robotAnimation: {
      rotate: [0, 15, 0],
      scale: [1, 1.2, 1],
      transition: { duration: 1, repeat: Infinity, ease: "easeInOut" }
    }
  },
  {
    title: "Type Your Message",
    description: "Type anything here and I'll help you! Ask questions, learn coding, or just chat!",
    element: ".message-input",
    icon: MessageSquare,
    spotlight: { size: 300 },
    zoom: 1.3,
    textOffset: { x: -250, y: -100 },
    robotAnimation: {
      y: [0, -8, 0],
      scale: [1, 1.1, 1],
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
    }
  },
  {
    title: "Find Past Chats",
    description: "Use the search to find our old conversations! It's like a treasure hunt!",
    element: ".search-input",
    icon: Search,
    spotlight: { size: 200 },
    zoom: 1.4,
    textOffset: { x: 150, y: 50 },
    robotAnimation: {
      rotate: [-10, 10, -10],
      scale: [1, 1.15, 1],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
  },
  {
    title: "Let's Get Started!",
    description: "Now you know how to use everything! Ready to start our adventure?",
    element: ".hero-section",
    icon: Sparkles,
    spotlight: { size: 400 },
    zoom: 1,
    textOffset: { x: 200, y: -100 },
    robotAnimation: {
      scale: [1, 1.2, 1],
      rotate: [0, 360, 0],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
  },
];

interface DashboardTutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function DashboardTutorial({ onComplete, onSkip }: DashboardTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [spotlightPosition, setSpotlightPosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Update window size
  useEffect(() => {
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const updateSpotlightPosition = useCallback(() => {
    const element = document.querySelector(tutorialSteps[currentStep].element);
    if (element) {
      const rect = element.getBoundingClientRect();
      setSpotlightPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
  }, [currentStep]);

  useEffect(() => {
    updateSpotlightPosition();
    window.addEventListener('resize', updateSpotlightPosition);
    return () => window.removeEventListener('resize', updateSpotlightPosition);
  }, [currentStep, updateSpotlightPosition]);

  const handleNext = () => {
    if (currentStep === tutorialSteps.length - 1) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Calculate tutorial text position to keep within viewport
  const getTutorialTextPosition = () => {
    const offset = tutorialSteps[currentStep]?.textOffset ?? { x: 200, y: -100 };
    const textWidth = 400; // Max width of tutorial text box
    const textHeight = 200; // Max height of tutorial text box
    
    let x = spotlightPosition.x + offset.x;
    let y = spotlightPosition.y + offset.y;

    // Keep text within viewport bounds with padding
    x = Math.max(20, Math.min(x, windowSize.width - textWidth - 20));
    y = Math.max(20, Math.min(y, windowSize.height - textHeight - 20));

    return { x, y };
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Semi-transparent overlay */}
      <motion.div
        className="absolute inset-0 bg-black pointer-events-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
      />

      {/* Spotlight effect */}
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          maskImage: `radial-gradient(circle ${tutorialSteps[currentStep].spotlight.size}px at ${spotlightPosition.x}px ${spotlightPosition.y}px, transparent 100%, black 100%)`,
          WebkitMaskImage: `radial-gradient(circle ${tutorialSteps[currentStep].spotlight.size}px at ${spotlightPosition.x}px ${spotlightPosition.y}px, transparent 100%, black 100%)`,
          transform: `scale(${tutorialSteps[currentStep].zoom || 1})`,
          transformOrigin: `${spotlightPosition.x}px ${spotlightPosition.y}px`,
        }}
      />

      {/* Robot Mascot */}
      <motion.div
        className="absolute"
        initial={{ scale: 0 }}
        animate={{
          scale: 1,
          x: spotlightPosition.x - 60,
          y: spotlightPosition.y - 60,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <motion.div
          className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg"
          animate={tutorialSteps[currentStep]?.robotAnimation ?? {
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          {(() => {
            const StepIcon = tutorialSteps[currentStep].icon;
            return <StepIcon className="w-12 h-12 text-white" />;
          })()}
        </motion.div>
      </motion.div>

      {/* Tutorial Text */}
      <motion.div
        className="absolute"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,
          ...getTutorialTextPosition()
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm pointer-events-auto">
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            {tutorialSteps[currentStep].title}
          </h3>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            {tutorialSteps[currentStep].description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {tutorialSteps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-2 rounded-full ${
                    index <= currentStep ? "bg-blue-500" : "bg-gray-200"
                  }`}
                  style={{ width: `${100 / tutorialSteps.length}%` }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                />
              ))}
            </div>
            <div className="flex gap-4">
              <button
                onClick={onSkip}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                Skip
              </button>
              <motion.button
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full font-medium flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentStep === tutorialSteps.length - 1 ? "Let's Go!" : "Next"}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
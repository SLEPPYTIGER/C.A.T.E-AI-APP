import { motion } from "framer-motion";
<<<<<<< HEAD
import { Bot, X, ArrowRight, Sparkles, MessageSquare, Moon, CheckCircle, Plus as PlusIcon } from "lucide-react";
import { BookmarkIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
=======
import { Bot, X, ArrowRight } from "lucide-react";
>>>>>>> a89900a86c9edb2d4213a789d9bdfbf54be1d2ac
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const tutorialSteps = [
  {
<<<<<<< HEAD
    title: "Welcome to CATE!",
    description: "Your AI companion for productive conversations. Let's explore the interface!",
=======
    title: "Welcome!",
    description: "I'm CATE, your AI assistant. Let's explore together!",
>>>>>>> a89900a86c9edb2d4213a789d9bdfbf54be1d2ac
    element: ".hero-section",
    mascotPosition: "center",
    zoom: 1,
    showArrow: false,
<<<<<<< HEAD
    icon: <Sparkles className="w-5 h-5 text-amber-400" />,
  },
  {
    title: "Start a New Chat",
    description: "Click this button to begin a fresh conversation with me.",
=======
  },
  {
    title: "New Chat",
    description: "Click here to start chatting with me.",
>>>>>>> a89900a86c9edb2d4213a789d9bdfbf54be1d2ac
    element: ".new-chat-button",
    mascotPosition: "left",
    zoom: 1.5,
    showArrow: true,
    arrowPosition: { x: "50%", y: "150px" },
<<<<<<< HEAD
    icon: <PlusIcon className="w-5 h-5 text-emerald-500" />,
  },
  {
    title: "Send a Message",
    description: "Type your questions, ideas, or requests here and I'll respond instantly.",
=======
  },
  {
    title: "Message Me",
    description: "Type your questions or ideas here.",
>>>>>>> a89900a86c9edb2d4213a789d9bdfbf54be1d2ac
    element: ".message-input",
    mascotPosition: "right",
    zoom: 1.3,
    showArrow: true,
    arrowPosition: { x: "calc(50% - 180px)", y: "70%" },
<<<<<<< HEAD
    icon: <MessageSquare className="w-5 h-5 text-blue-500" />,
  },
  {
    title: "Recent Conversations",
    description: "Toggle between viewing your recent chats or all conversations.",
    element: "button:has(> .BookmarkIcon), button:has(> svg[data-icon='bookmark'])",
    mascotPosition: "left",
    zoom: 1.4,
    showArrow: true,
    arrowPosition: { x: "50%", y: "220px" },
    icon: <BookmarkIcon className="w-5 h-5 text-indigo-500" />,
  },
  {
    title: "Dark Mode",
    description: "Switch between light and dark themes for comfortable viewing day or night.",
    element: "button:has(> .Half2Icon), button:has(> .Half1Icon), button:has(> svg[data-icon='half-2']), button:has(> svg[data-icon='half-1'])",
    mascotPosition: "left",
    zoom: 1.4,
    showArrow: true,
    arrowPosition: { x: "50%", y: "280px" },
    icon: <Moon className="w-5 h-5 text-purple-500" />,
  },
  {
    title: "Collapse Sidebar",
    description: "Toggle the sidebar to save space or expand it for full navigation.",
    element: "button:has(> .ChevronLeftIcon), button:has(> .ChevronRightIcon), button:has(> svg[data-icon='chevron-left']), button:has(> svg[data-icon='chevron-right'])",
    mascotPosition: "left",
    zoom: 1.4,
    showArrow: true,
    arrowPosition: { x: "50%", y: "340px" },
    icon: <ChevronLeftIcon className="w-5 h-5 text-teal-500" />,
  },
  {
    title: "You're All Set!",
    description: "You're ready to explore the full potential of CATE. Let's start creating!",
=======
  },
  {
    title: "Search Chats",
    description: "Find past conversations easily.",
    element: ".search-input",
    mascotPosition: "right",
    zoom: 1.4,
    showArrow: true,
    arrowPosition: { x: "300px", y: "150px" },
  },
  {
    title: "Ready!",
    description: "You're set to learn and create with CATE!",
>>>>>>> a89900a86c9edb2d4213a789d9bdfbf54be1d2ac
    element: ".hero-section",
    mascotPosition: "center",
    zoom: 1,
    showArrow: false,
<<<<<<< HEAD
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
=======
>>>>>>> a89900a86c9edb2d4213a789d9bdfbf54be1d2ac
  },
];

interface InteractiveTutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function InteractiveTutorial({ onComplete, onSkip }: InteractiveTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [elementPosition, setElementPosition] = useState({ x: 0, y: 0 });
  const router = useRouter();

  useEffect(() => {
    const updateElementPosition = () => {
      const element = document.querySelector(tutorialSteps[currentStep].element);
      if (element) {
        const rect = element.getBoundingClientRect();
        setElementPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }
    };

    updateElementPosition();
    window.addEventListener("resize", updateElementPosition);
    return () => window.removeEventListener("resize", updateElementPosition);
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep === tutorialSteps.length - 1) {
      onComplete();
      router.push("/dashboard");
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
<<<<<<< HEAD
      {/* Overlay with improved blur effect */}
      <motion.div
        className="absolute inset-0 bg-gray-900/50 dark:bg-[#1A1A1A]/50 backdrop-blur-sm pointer-events-auto"
=======
      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-gray-900/60 pointer-events-auto"
>>>>>>> a89900a86c9edb2d4213a789d9bdfbf54be1d2ac
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

<<<<<<< HEAD
      {/* Enhanced Spotlight with smoother gradient */}
      <motion.div
        className="absolute inset-0 bg-black/30 dark:bg-[#1A1A1A]/30"
        style={{
          maskImage: `radial-gradient(circle 200px at ${elementPosition.x}px ${elementPosition.y}px, transparent 70%, black 100%)`,
          WebkitMaskImage: `radial-gradient(circle 200px at ${elementPosition.x}px ${elementPosition.y}px, transparent 70%, black 100%)`,
=======
      {/* Spotlight */}
      <motion.div
        className="absolute inset-0 bg-black/40"
        style={{
          maskImage: `radial-gradient(circle 180px at ${elementPosition.x}px ${elementPosition.y}px, transparent 80%, black 100%)`,
          WebkitMaskImage: `radial-gradient(circle 180px at ${elementPosition.x}px ${elementPosition.y}px, transparent 80%, black 100%)`,
>>>>>>> a89900a86c9edb2d4213a789d9bdfbf54be1d2ac
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

<<<<<<< HEAD
      {/* Modernized Mascot with glow effect */}
=======
      {/* Mascot */}
>>>>>>> a89900a86c9edb2d4213a789d9bdfbf54be1d2ac
      <motion.div
        className="absolute z-10"
        initial={{ scale: 0 }}
        animate={{
          scale: 1,
          x: tutorialSteps[currentStep].mascotPosition === "center" ? "calc(50% - 32px)" :
              tutorialSteps[currentStep].mascotPosition === "left" ? "calc(50% - 240px)" : "calc(50% + 160px)",
          y: "20%",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
<<<<<<< HEAD
          className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-600 dark:from-[#4A90E2] dark:via-[#3A80D2] dark:to-[#357ABD] rounded-full flex items-center justify-center shadow-lg relative"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-indigo-500 dark:bg-[#4A90E2] opacity-30 blur-md" />
          <Bot className="w-10 h-10 text-white relative z-10" />
        </motion.div>
      </motion.div>

      {/* Enhanced Arrow with pulse effect */}
      {tutorialSteps[currentStep].showArrow && (
        <motion.div
          className="absolute z-10 text-indigo-400 dark:text-[#4A90E2]"
=======
          className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-md"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Bot className="w-10 h-10 text-white" />
        </motion.div>
      </motion.div>

      {/* Arrow */}
      {tutorialSteps[currentStep].showArrow && (
        <motion.div
          className="absolute z-10 text-indigo-400"
>>>>>>> a89900a86c9edb2d4213a789d9bdfbf54be1d2ac
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: tutorialSteps[currentStep].arrowPosition?.x || 0,
            y: tutorialSteps[currentStep].arrowPosition?.y || 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div
<<<<<<< HEAD
            animate={{ x: [0, 8, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <ArrowRight className="w-8 h-8 drop-shadow-md" />
=======
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <ArrowRight className="w-8 h-8" />
>>>>>>> a89900a86c9edb2d4213a789d9bdfbf54be1d2ac
          </motion.div>
        </motion.div>
      )}

<<<<<<< HEAD
      {/* Modernized Dialog with glass effect */}
      <motion.div
        className="bg-white/90 dark:bg-[#2A2A2A]/90 backdrop-blur-md rounded-2xl p-6 shadow-xl pointer-events-auto w-full max-w-md mx-4 border border-gray-100/50 dark:border-gray-600/30"
=======
      {/* Dialog */}
      <motion.div
        className="bg-white rounded-xl p-5 shadow-lg pointer-events-auto w-full max-w-sm mx-4 border border-gray-100"
>>>>>>> a89900a86c9edb2d4213a789d9bdfbf54be1d2ac
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{ position: "absolute", bottom: "5%", left: "50%", transform: "translateX(-50%)" }}
      >
        <button
          onClick={onSkip}
<<<<<<< HEAD
          className="absolute top-3 right-3 text-gray-500 dark:text-[#D4D4D4] hover:text-gray-700 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
=======
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-4 h-4" />
>>>>>>> a89900a86c9edb2d4213a789d9bdfbf54be1d2ac
        </button>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.3 }}
<<<<<<< HEAD
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            {tutorialSteps[currentStep].icon}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{tutorialSteps[currentStep].title}</h3>
          </div>
          <p className="text-gray-600 dark:text-[#B0B0B0] text-sm leading-relaxed">{tutorialSteps[currentStep].description}</p>
        </motion.div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex space-x-1.5">
            {tutorialSteps.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2.5 h-2.5 rounded-full ${
                  index === currentStep
                    ? "bg-gradient-to-r from-indigo-500 to-blue-500 dark:from-[#4A90E2] dark:to-[#357ABD]"
                    : "bg-gray-200 dark:bg-gray-600"
                }`}
                initial={{ scale: 0.8 }}
                animate={{
                  scale: index === currentStep ? 1.2 : 1,
                  opacity: index === currentStep ? 1 : 0.7
                }}
=======
          className="space-y-3"
        >
          <h3 className="text-xl font-semibold text-gray-900">{tutorialSteps[currentStep].title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{tutorialSteps[currentStep].description}</p>
        </motion.div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex space-x-1">
            {tutorialSteps.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentStep ? "bg-indigo-500" : "bg-gray-200"}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: index === currentStep ? 1.2 : 1 }}
>>>>>>> a89900a86c9edb2d4213a789d9bdfbf54be1d2ac
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>
          <motion.button
            onClick={handleNext}
<<<<<<< HEAD
            className="bg-gradient-to-r from-indigo-500 to-blue-500 dark:from-[#4A90E2] dark:to-[#357ABD] text-white px-5 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)" }}
            whileTap={{ scale: 0.95 }}
          >
            {currentStep === tutorialSteps.length - 1 ? "Get Started" : "Next"}
=======
            className="bg-indigo-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-indigo-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {currentStep === tutorialSteps.length - 1 ? "Start" : "Next"}
>>>>>>> a89900a86c9edb2d4213a789d9bdfbf54be1d2ac
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
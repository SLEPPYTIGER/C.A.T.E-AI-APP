import { motion } from "framer-motion";
import { Bot, X, ArrowRight, Sparkles, MessageSquare, Moon, CheckCircle, Plus as PlusIcon } from "lucide-react";
import { BookmarkIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const tutorialSteps = [
  {
    title: "Welcome to CATE!",
    description: "Your AI companion for productive conversations. Let's explore the interface!",
    element: ".hero-section",
    mascotPosition: "center",
    zoom: 1,
    showArrow: false,
    icon: <Sparkles className="w-5 h-5 text-amber-400" />,
  },
  {
    title: "Start a New Chat",
    description: "Click this button to begin a fresh conversation with me.",
    element: ".new-chat-button",
    mascotPosition: "left",
    zoom: 1.5,
    showArrow: true,
    arrowPosition: { x: "50%", y: "150px" },
    icon: <PlusIcon className="w-5 h-5 text-emerald-500" />,
  },
  {
    title: "Send a Message",
    description: "Type your questions, ideas, or requests here and I'll respond instantly.",
    element: ".message-input",
    mascotPosition: "right",
    zoom: 1.3,
    showArrow: true,
    arrowPosition: { x: "calc(50% - 180px)", y: "70%" },
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
    element: ".hero-section",
    mascotPosition: "center",
    zoom: 1,
    showArrow: false,
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
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
      {/* Overlay with improved blur effect */}
      <motion.div
        className="absolute inset-0 bg-gray-900/50 dark:bg-[#1A1A1A]/50 backdrop-blur-sm pointer-events-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Enhanced Spotlight with smoother gradient */}
      <motion.div
        className="absolute inset-0 bg-black/30 dark:bg-[#1A1A1A]/30"
        style={{
          maskImage: `radial-gradient(circle 200px at ${elementPosition.x}px ${elementPosition.y}px, transparent 70%, black 100%)`,
          WebkitMaskImage: `radial-gradient(circle 200px at ${elementPosition.x}px ${elementPosition.y}px, transparent 70%, black 100%)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Modernized Mascot with glow effect */}
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
            animate={{ x: [0, 8, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <ArrowRight className="w-8 h-8 drop-shadow-md" />
          </motion.div>
        </motion.div>
      )}

      {/* Modernized Dialog with glass effect */}
      <motion.div
        className="bg-white/90 dark:bg-[#2A2A2A]/90 backdrop-blur-md rounded-2xl p-6 shadow-xl pointer-events-auto w-full max-w-md mx-4 border border-gray-100/50 dark:border-gray-600/30"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{ position: "absolute", bottom: "5%", left: "50%", transform: "translateX(-50%)" }}
      >
        <button
          onClick={onSkip}
          className="absolute top-3 right-3 text-gray-500 dark:text-[#D4D4D4] hover:text-gray-700 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.3 }}
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
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>
          <motion.button
            onClick={handleNext}
            className="bg-gradient-to-r from-indigo-500 to-blue-500 dark:from-[#4A90E2] dark:to-[#357ABD] text-white px-5 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)" }}
            whileTap={{ scale: 0.95 }}
          >
            {currentStep === tutorialSteps.length - 1 ? "Get Started" : "Next"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
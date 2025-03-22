import { motion } from "framer-motion";
import { Bot, X, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const tutorialSteps = [
  {
    title: "Welcome!",
    description: "I'm CATE, your AI assistant. Let's explore together!",
    element: ".hero-section",
    mascotPosition: "center",
    zoom: 1,
    showArrow: false,
  },
  {
    title: "New Chat",
    description: "Click here to start chatting with me.",
    element: ".new-chat-button",
    mascotPosition: "left",
    zoom: 1.5,
    showArrow: true,
    arrowPosition: { x: "50%", y: "150px" },
  },
  {
    title: "Message Me",
    description: "Type your questions or ideas here.",
    element: ".message-input",
    mascotPosition: "right",
    zoom: 1.3,
    showArrow: true,
    arrowPosition: { x: "calc(50% - 180px)", y: "70%" },
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
    element: ".hero-section",
    mascotPosition: "center",
    zoom: 1,
    showArrow: false,
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
      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-gray-900/60 pointer-events-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Spotlight */}
      <motion.div
        className="absolute inset-0 bg-black/40"
        style={{
          maskImage: `radial-gradient(circle 180px at ${elementPosition.x}px ${elementPosition.y}px, transparent 80%, black 100%)`,
          WebkitMaskImage: `radial-gradient(circle 180px at ${elementPosition.x}px ${elementPosition.y}px, transparent 80%, black 100%)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Mascot */}
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
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <ArrowRight className="w-8 h-8" />
          </motion.div>
        </motion.div>
      )}

      {/* Dialog */}
      <motion.div
        className="bg-white rounded-xl p-5 shadow-lg pointer-events-auto w-full max-w-sm mx-4 border border-gray-100"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{ position: "absolute", bottom: "5%", left: "50%", transform: "translateX(-50%)" }}
      >
        <button
          onClick={onSkip}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.3 }}
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
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>
          <motion.button
            onClick={handleNext}
            className="bg-indigo-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-indigo-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {currentStep === tutorialSteps.length - 1 ? "Start" : "Next"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
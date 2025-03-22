import { createContext, useContext } from "react";

interface TutorialContextType {
  showTutorial: boolean;
  setShowTutorial: (show: boolean) => void;
}

export const TutorialContext = createContext<TutorialContextType>({
  showTutorial: false,
  setShowTutorial: () => {},
});

export const useTutorial = () => useContext(TutorialContext);
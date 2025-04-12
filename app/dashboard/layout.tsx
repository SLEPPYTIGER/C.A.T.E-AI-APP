"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { NavigationProvider } from "@/lib/NavigationProvider";
import { Authenticated } from "convex/react";
import { useState } from "react";
import { TutorialContext } from "@/lib/TutorialContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showTutorial, setShowTutorial] = useState(true);

  return (
    <NavigationProvider>
      <TutorialContext.Provider value={{ showTutorial, setShowTutorial }}>
        <div className="flex h-screen">
          <Authenticated>
            <Sidebar />
          </Authenticated>

          <div className="flex-1">
            <Header onShowTutorial={() => setShowTutorial(true)} />
            <main>{children}</main>
          </div>
        </div>
      </TutorialContext.Provider>
    </NavigationProvider>
  );
}
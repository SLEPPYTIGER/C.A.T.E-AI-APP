"use client";

import { createContext, useState } from "react";

interface NavigationContextType {
    isMobileNavOpen: boolean;
    setIsMobileNavOpen: (open: boolean) => void;
    closeMobileNav: () => void;
    isSidebarVisible: boolean;
    toggleSidebar: () => void;
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    recentChatId: string | null;
    setRecentChatId: (id: string) => void;
}

export const NavigationContext = createContext<NavigationContextType>({
    isMobileNavOpen: false,
    setIsMobileNavOpen: () => {},
    closeMobileNav: () => {},
    isSidebarVisible: true,
    toggleSidebar: () => {},
    isDarkMode: false,
    toggleDarkMode: () => {},
    recentChatId: null,
    setRecentChatId: () => {},
});

export function NavigationProvider({
    children,
}: { 
    children: React.ReactNode;
}) {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [recentChatId, setRecentChatId] = useState<string | null>(null);

    const closeMobileNav = () => setIsMobileNavOpen(false);
    const toggleSidebar = () => setIsSidebarVisible(prev => !prev);
    const toggleDarkMode = () => {
        setIsDarkMode(prev => {
            const newValue = !prev;
            if (newValue) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
            return newValue;
        });
    };

    return ( 
        <NavigationContext.Provider
            value={{
                isMobileNavOpen,
                setIsMobileNavOpen,
                closeMobileNav,
                isSidebarVisible,
                toggleSidebar,
                isDarkMode,
                toggleDarkMode,
                recentChatId,
                setRecentChatId
            }}
        >
            {children}
        </NavigationContext.Provider>
    );
}
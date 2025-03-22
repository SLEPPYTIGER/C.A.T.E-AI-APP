"use client";

import { createContext, useState } from "react";

interface NavigationContextType {
    isMobileNavOpen: boolean;
    setIsMobileNavOpen: (open: boolean) => void;
    closeMobileNav: () => void;
    isSidebarVisible: boolean;
    toggleSidebar: () => void;
}

export const NavigationContext = createContext<NavigationContextType>({
    isMobileNavOpen: false,
    setIsMobileNavOpen: () => {},
    closeMobileNav: () => {},
    isSidebarVisible: true,
    toggleSidebar: () => {},
});

export function NavigationProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    const closeMobileNav = () => setIsMobileNavOpen(false);
    const toggleSidebar = () => setIsSidebarVisible(prev => !prev);

    return (
        <NavigationContext.Provider
            value={{
                isMobileNavOpen,
                setIsMobileNavOpen,
                closeMobileNav,
                isSidebarVisible,
                toggleSidebar
            }}
        >
            {children}
        </NavigationContext.Provider>
    );
}
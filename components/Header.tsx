"use client";

import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { HamburgerMenuIcon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { useContext } from "react";
import { NavigationContext } from "@/lib/NavigationProvider";
import { motion } from "framer-motion";
import Link from "next/link";

interface HeaderProps {
  onShowTutorial?: () => void;
}

function Header({ onShowTutorial }: HeaderProps) {
  const navigation = useContext(NavigationContext);

  if (!navigation) {
    return null; // Return early if context is not available
  }

  const { setIsMobileNavOpen } = navigation;

  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 },
    },
  };

  const logoVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { scale: 1.1, rotate: 5, transition: { type: "spring", stiffness: 400 } },
    animate: {
      y: [0, -3, 0],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },
  };

  const textVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const navItemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.05, color: "#3b82f6", transition: { type: "spring", stiffness: 300 } },
  };

  const glowVariants = {
    animate: {
      opacity: [0.2, 0.3, 0.2],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        repeatDelay: 1,
      },
    },
  };

  // Navigation links
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/features" },
    { label: "About Us", href: "/aboutus" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <motion.header
      className="border-b border-gray-200/20 bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-xl sticky top-0 z-50 shadow-sm"
      initial="hidden"
      animate="visible"
      variants={headerVariants}
    >
      {/* Subtle background animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-100/10 via-violet-100/10 to-transparent dark:from-[#4A90E2]/10 dark:via-[#4A90E2]/5 dark:to-transparent will-change-transform"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto relative z-10">
        {/* Left Section: Logo & Title */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileNavOpen(true)}
            className="md:hidden text-gray-600 dark:text-[#D4D4D4] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-[#3A3A3A]/50 rounded-full p-2 transition-all duration-300"
          >
            <motion.div
              whileHover={{ rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <HamburgerMenuIcon className="h-5 w-5" />
            </motion.div>
          </Button>

          {/* Logo & Title */}
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              className="relative"
              variants={logoVariants}
              initial="initial"
              whileHover="hover"
              animate="animate"
            >
              {/* Cute Robot Logo */}
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-violet-500 dark:from-[#4A90E2] dark:to-[#357ABD] rounded-lg flex items-center justify-center overflow-hidden shadow-md">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  {/* Robot Head */}
                  <rect x="6" y="8" width="14" height="12" rx="3" fill="currentColor" />
                  {/* Eyes with optimized bounce */}
                  <motion.g className="will-change-transform">
                    <motion.circle
                      cx="10"
                      cy="13"
                      r="1.8"
                      fill="#ffffff"
                      animate={{ y: [0, -1, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                    />
                    <motion.circle
                      cx="16"
                      cy="13"
                      r="1.8"
                      fill="#ffffff"
                      animate={{ y: [0, -1, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                    />
                  </motion.g>
                  {/* Antenna */}
                  <rect x="12.5" y="4" width="1" height="4" fill="currentColor" />
                  <circle cx="13" cy="3" r="1.2" fill="currentColor" />
                </svg>
              </div>

              {/* Glowing accent */}
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-violet-400 dark:from-[#4A90E2] dark:to-[#357ABD] opacity-20 blur-lg rounded-lg"
                variants={glowVariants}
                animate="animate"
              />
            </motion.div>

            <motion.div
              className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-[#D4D4D4] dark:to-[#A0A0A0] bg-clip-text text-transparent tracking-tight hidden md:block"
              variants={textVariants}
              initial="initial"
              animate="animate"
            >
              Compiler Assistant Technical Entrecities
            </motion.div>
          </Link>
        </div>

        {/* Center Section: Navigation Links */}
        <motion.nav
          className="hidden md:flex items-center gap-8"
          initial="initial"
          animate="animate"
          variants={headerVariants}
        >
          {navLinks.map(({ label, href }) => (
            <motion.div key={label} variants={navItemVariants} whileHover="hover">
              <Link
                href={href}
                className="text-gray-700 dark:text-[#D4D4D4] hover:text-blue-500 dark:hover:text-[#4A90E2] text-sm font-medium transition-colors duration-200 relative"
              >
                {label}
                <motion.span
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-500 dark:bg-[#4A90E2] rounded-full"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </Link>
            </motion.div>
          ))}
        </motion.nav>

        {/* Right Section: User Button */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <motion.button
              onClick={onShowTutorial}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-[#2A2A2A] hover:bg-gray-200 dark:hover:bg-[#3A3A3A] text-gray-600 dark:text-[#D4D4D4] hover:text-gray-900 dark:hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Show Tutorial"
            >
              <QuestionMarkCircledIcon className="w-5 h-5" />
            </motion.button>
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "h-10 w-10 ring-2 ring-gray-200/50 dark:ring-gray-600/50 ring-offset-2 rounded-full transition-all duration-300 hover:ring-blue-400/50 dark:hover:ring-[#4A90E2]/50 hover:ring-3 hover:shadow-md",
                  userButtonTrigger: "focus:outline-none",
                },
              }}
            />
          </div>
          {/* Optional CTA Button */}
          <Link href="/get-started">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:block"
            >
              <Button className="bg-gradient-to-r from-blue-500 to-violet-500 dark:from-[#4A90E2] dark:to-[#357ABD] text-white rounded-full px-5 py-2 shadow-md hover:shadow-lg transition-all duration-300">
                Get Started
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </motion.header>
  );
}

export default Header;
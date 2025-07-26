"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Brain,
  Home,
  ArrowLeft,
  Search,
  BookOpen,
  Dumbbell,
  Calendar,
  Target,
  HelpCircle,
  Compass,
  Zap,
  RotateCcw,
} from "lucide-react";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const slideInLeft = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7, ease: "easeOut" },
  };

  const slideInRight = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7, ease: "easeOut" },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const bounceAnimation = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        duration: 0.8,
      },
    },
  };

  const floatingAnimation = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Custom SVG Components
  const BackgroundSVG = () => (
    <svg
      className="absolute inset-0 w-full h-full opacity-10"
      viewBox="0 0 1000 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gradient404" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3EB489" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#2ea374" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id="radialGradient404" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3EB489" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#3EB489" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="150" fill="url(#radialGradient404)" />
      <circle cx="800" cy="800" r="200" fill="url(#radialGradient404)" />
      <path
        d="M100 500 Q 300 300 500 500 T 900 500"
        stroke="url(#gradient404)"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M500 100 Q 750 350 500 500 T 500 900"
        stroke="url(#gradient404)"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );

  const Illustration404SVG = () => (
    <svg width="400" height="300" viewBox="0 0 400 300" fill="none">
      <defs>
        <linearGradient
          id="illustrationGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#3EB489" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#2ea374" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Background Circle */}
      <circle
        cx="200"
        cy="150"
        r="120"
        fill="url(#illustrationGradient)"
        opacity="0.2"
      />

      {/* 404 Numbers */}
      <text
        x="200"
        y="170"
        textAnchor="middle"
        className="text-8xl font-bold fill-[#3EB489] opacity-30"
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        404
      </text>

      {/* Floating Elements */}
      <motion.circle
        cx="100"
        cy="80"
        r="6"
        fill="#3EB489"
        opacity="0.6"
        animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="300"
        cy="100"
        r="4"
        fill="#2ea374"
        opacity="0.7"
        animate={{ y: [0, 15, 0], x: [0, -8, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.circle
        cx="320"
        cy="220"
        r="5"
        fill="#3EB489"
        opacity="0.5"
        animate={{ y: [0, -12, 0], x: [0, 3, 0] }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </svg>
  );

  const quickActions = [
    {
      icon: Home,
      label: "Go Home",
      description: "Return to dashboard",
      action: "home",
    },
    {
      icon: Calendar,
      label: "Today's Schedule",
      description: "View your daily plan",
      action: "schedule",
    },
    {
      icon: Dumbbell,
      label: "Fitness Tracker",
      description: "Check workout progress",
      action: "fitness",
    },
    {
      icon: BookOpen,
      label: "Study Progress",
      description: "Review study sessions",
      action: "study",
    },
  ];

  const handleNavigation = (action) => {
    console.log(`Navigating to: ${action}`);
    // Handle navigation logic here
  };

  const handleSearch = () => {
    console.log("Search submitted");
    // Handle search logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      <BackgroundSVG />

      {/* Header */}
      <motion.header
        className="relative z-10 backdrop-blur-md bg-white/5 border-b border-white/10"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <nav className="container mx-auto px-6 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[#3EB489] to-[#2ea374] rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                FitFocus
              </span>
            </motion.div>

            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="bg-gradient-to-r from-[#3EB489] to-[#2ea374] hover:from-[#2ea374] hover:to-[#3EB489] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => handleNavigation("home")}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </motion.div>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-16 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-200px)]">
          {/* Left Side - Illustration */}
          <motion.div
            className="flex justify-center lg:justify-end"
            variants={slideInLeft}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={floatingAnimation} animate="animate">
              <Illustration404SVG />
            </motion.div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            className="space-y-8"
            variants={slideInRight}
            initial="initial"
            animate="animate"
          >
            <div className="space-y-6">
              <motion.div
                className="inline-flex items-center space-x-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 text-sm"
                variants={bounceAnimation}
                initial="initial"
                animate="animate"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-400 font-medium">Page Not Found</span>
              </motion.div>

              <motion.h1
                className="text-3xl lg:text-5xl font-medium leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Oops! Page{" "}
                <motion.span
                  className="bg-gradient-to-r from-[#3EB489] to-[#2ea374] bg-clip-text text-transparent bitcount-grid-single-hero md:text-4xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  Lost
                </motion.span>{" "}
                in Space
              </motion.h1>

              <motion.p
                className="text-xl text-gray-300 leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                The page you're looking for seems to have wandered off during a
                workout session. Don't worry, let's get you back on track with
                your perfect balance routine.
              </motion.p>
            </div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#3EB489] to-[#2ea374] hover:from-[#2ea374] hover:to-[#3EB489] text-white px-8 py-6 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                  onClick={() => handleNavigation("home")}
                >
                  <Home className="mr-2 w-5 h-5" />
                  Back to Dashboard
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 px-8 py-6 text-lg rounded-2xl backdrop-blur-sm transition-all duration-300"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="mr-2 w-5 h-5" />
                  Go Back
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Quick Actions Section */}
        <motion.section
          className="mt-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Quick <span className="text-[#3EB489]">Navigation</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Jump to your favorite sections and continue your journey
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                custom={index}
                whileHover={{
                  scale: 1.05,
                  y: -8,
                  transition: { type: "spring", stiffness: 300, damping: 20 },
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-[#3EB489]/30 transition-all duration-500 cursor-pointer shadow-xl hover:shadow-2xl"
                  onClick={() => handleNavigation(action.action)}
                >
                  <CardContent className="p-8 text-center space-y-4">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-[#3EB489]/20 to-[#2ea374]/10 rounded-2xl flex items-center justify-center mx-auto shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <action.icon className="w-8 h-8 text-[#3EB489]" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white">
                      {action.label}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </main>
    </div>
  );
}

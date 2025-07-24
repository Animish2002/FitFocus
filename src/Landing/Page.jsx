"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Brain,
  Dumbbell,
  BookOpen,
  MessageSquare,
  Zap,
  TrendingUp,
  Github,
  Linkedin,
  Mail,
  Star,
  Check,
  Play,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const slideInLeft = {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7, ease: "easeOut" },
  };

  const slideInRight = {
    initial: { opacity: 0, x: 30 },
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

  const subtleHover = {
    hover: {
      scale: 1.02,
      y: -4,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  const cardHover = {
    hover: {
      scale: 1.03,
      y: -8,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
  };

  // Custom SVG Components
  const BackgroundSVG = () => (
    <svg
      className="absolute inset-0 w-full h-full opacity-20"
      viewBox="0 0 1000 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3EB489" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#2ea374" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="200" r="150" fill="url(#gradient1)" />
      <circle cx="800" cy="600" r="200" fill="url(#gradient1)" />
      <path
        d="M100 500 Q 300 300 500 500 T 900 500"
        stroke="#3EB489"
        strokeWidth="2"
        fill="none"
        opacity="0.3"
      />
    </svg>
  );

  const FitnessIconSVG = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" fill="#3EB489" fillOpacity="0.1" />
      <path
        d="M12 20h4m8 0h4m-14-4v8m16-8v8M16 18h8v4h-8v-4z"
        stroke="#3EB489"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const StudyIconSVG = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" fill="#3EB489" fillOpacity="0.1" />
      <path
        d="M12 16h16M12 20h12M12 24h16M16 12v16"
        stroke="#3EB489"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

  const AIBrainSVG = () => (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      className="text-white"
    >
      <circle cx="20" cy="20" r="18" fill="#3EB489" fillOpacity="0.1" />
      <path
        d="M20 12c-4.4 0-8 3.6-8 8 0 1.4.4 2.7 1 3.8L20 32l7-8.2c.6-1.1 1-2.4 1-3.8 0-4.4-3.6-8-8-8z"
        stroke="#3EB489"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="20" cy="20" r="3" fill="#3EB489" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-zinc-900 text-white overflow-hidden">
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
              ></motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-gradient-to-r from-[#3EB489] to-[#2ea374] hover:from-[#2ea374] hover:to-[#3EB489] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  Get Started
                </Button>
              </motion.div>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-24 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            className="space-y-8"
            variants={slideInLeft}
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-[#3EB489]/10 border border-[#3EB489]/20 rounded-full px-4 py-2 text-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="w-2 h-2 bg-[#3EB489] rounded-full animate-pulse"></div>
              <span className="text-[#3EB489] font-medium bitcount-grid-single-hero">
                AI-Powered Planning
              </span>
            </motion.div>

            <div className="space-y-6">
              <motion.h1
                className="text-5xl lg:text-7xl font-medium leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Perfect&nbsp;
                <motion.span
                  className="bg-gradient-to-r from-[#3EB489] to-[#2ea374] bg-clip-text text-transparent bitcount-grid-single-hero"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  Balance
                </motion.span>{" "}
                for Body & Mind
              </motion.h1>

              <motion.p
                className="text-xl text-gray-300 leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Transform your daily routine with AI that seamlessly integrates
                fitness training and CAT exam preparation for peak performance.
              </motion.p>
            </div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <motion.div
                variants={subtleHover}
                whileHover="hover"
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#3EB489] to-[#2ea374] hover:from-[#2ea374] hover:to-[#3EB489] text-white px-8 py-6 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            variants={slideInRight}
            initial="initial"
            animate="animate"
          >
            <div className="relative">
              <motion.div
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
                whileHover={{ y: -10, rotateY: 5, rotateX: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold bitcount-grid-single-hero">
                      Today's Schedule
                    </h3>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        time: "06:00",
                        activity: "Morning Workout",
                        type: "fitness",
                        icon: <FitnessIconSVG />,
                      },
                      {
                        time: "08:30",
                        activity: "QA Practice",
                        type: "study",
                        icon: <StudyIconSVG />,
                      },
                      {
                        time: "11:00",
                        activity: "VARC Session",
                        type: "study",
                        icon: <StudyIconSVG />,
                      },
                      {
                        time: "16:00",
                        activity: "Cardio Session",
                        type: "fitness",
                        icon: <FitnessIconSVG />,
                      },
                      {
                        time: "19:00",
                        activity: "DILR Practice",
                        type: "study",
                        icon: <StudyIconSVG />,
                      },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center space-x-4 p-3 rounded-xl bg-white/5 border border-white/10"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 + i * 0.1 }}
                      >
                        {item.icon}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium bitcount-grid-single-hero">
                              {item.activity}
                            </span>
                            <span className="text-sm text-gray-400 bitcount-grid-single-hero">
                              {item.time}
                            </span>
                          </div>
                        </div>
                        <Check className="w-4 h-4 text-[#3EB489]" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 py-24 max-w-7xl">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-[#3EB489]/10 border border-[#3EB489]/20 rounded-full px-4 py-2 text-sm mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Zap className="w-4 h-4 text-[#3EB489]" />
            <span className="text-[#3EB489] font-medium bitcount-grid-single-hero">
              Powerful Features
            </span>
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-medium mb-6">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-[#3EB489] to-[#2ea374] bg-clip-text text-transparent bitcount-grid-single-hero">
              Excel
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Intelligent features designed for peak performance in both fitness
            and academics
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={staggerChildren}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {[
            {
              icon: Brain,
              title: "AI-Generated Daily Plans",
              description:
                "Smart scheduling that adapts to your energy levels, deadlines, and preferences for optimal productivity.",
              gradient: "from-blue-500/20 to-purple-500/20",
            },
            {
              icon: Dumbbell,
              title: "Fitness Integration",
              description:
                "Complete weights and cardio tracking with workout suggestions that complement your study schedule.",
              gradient: "from-green-500/20 to-emerald-500/20",
            },
            {
              icon: BookOpen,
              title: "CAT Exam Study Tracker",
              description:
                "Structured preparation for QA, VARC, and DILR with progress tracking and adaptive scheduling to prepare for your exams.",
              gradient: "from-orange-500/20 to-red-500/20",
            },
          ].map((feature, index) => (
            <motion.div key={index} variants={fadeInUp} custom={index}>
              <motion.div variants={cardHover} whileHover="hover">
                <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-[#3EB489]/30 transition-all duration-500 h-full shadow-xl hover:shadow-2xl">
                  <CardContent className="p-8 text-center space-y-6">
                    <motion.div
                      className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <feature.icon className="w-8 h-8 text-[#3EB489]" />
                    </motion.div>
                    <h3 className="text-xl font-light text-zinc-50">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 container mx-auto px-6 py-24 max-w-7xl">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl lg:text-5xl font-medium mb-6 ">
            Simple Steps to{" "}
            <span className="bg-gradient-to-r from-[#3EB489] to-[#2ea374] bg-clip-text text-transparent bitcount-grid-single-hero">
              Transform
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get started in minutes with our intuitive three-step process
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          variants={staggerChildren}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {[
            {
              step: "01",
              icon: MessageSquare,
              title: "Describe Your Goals",
              description:
                "Tell us your fitness targets, study objectives, and available time for personalized planning.",
            },
            {
              step: "02",
              icon: Zap,
              title: "AI Creates Your Plan",
              description:
                "Our intelligent system generates a balanced schedule optimizing both workout and study sessions.",
            },
            {
              step: "03",
              icon: TrendingUp,
              title: "Track & Improve",
              description:
                "Monitor progress, build habits, and watch your performance soar with detailed analytics.",
            },
          ].map((step, index) => (
            <motion.div
              key={index}
              className="text-center space-y-6 relative"
              variants={fadeInUp}
              custom={index}
            >
              <div className="relative">
                <motion.div
                  className="w-24 h-24 bg-gradient-to-br from-[#3EB489] to-[#2ea374] rounded-3xl flex items-center justify-center mx-auto text-2xl font-bold shadow-xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {step.step}
                </motion.div>
                <motion.div
                  className="absolute -top-2 -right-2 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <step.icon className="w-5 h-5 text-[#3EB489]" />
                </motion.div>
              </div>
              <h3 className="text-2xl font-light">{step.title}</h3>
              <p className="text-gray-300 leading-relaxed text-sm">
                {step.description}
              </p>
              {index < 2 && (
                <motion.div
                  className="hidden md:block absolute top-12 left-full w-8 h-0.5 bg-gradient-to-r from-[#3EB489] to-transparent"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.2, duration: 0.8 }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* About Me */}
      <section className="relative z-10 container mx-auto px-6 py-24 max-w-7xl">
        <motion.div
          className="max-w-4xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl lg:text-5xl font-medium mb-8 ">
            Meet the&nbsp;
            <span className="bg-gradient-to-r from-[#3EB489] to-[#2ea374] bg-clip-text text-transparent bitcount-grid-single-hero">
              Creator
            </span>
          </h2>

          <motion.div
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className="text-[16px] text-gray-300 leading-relaxed mb-8">
              Hi, I'm&nbsp;&nbsp;
              <span className="text-[#3EB489] font-bold text-3xl ">
                <a
                  href="https://www.animishchopade.in/"
                  className="bitcount-grid-single-hero"
                >
                  Animish&nbsp;Chopade
                </a>
              </span>
              , a FullStack Developer and a CAT aspirant who struggled to
              balance intense study sessions with maintaining physical fitness.
              After countless failed attempts at manual scheduling, I built
              FitFocus to solve this exact problem. This AI-powered tool has
              transformed my daily routine, and I'm excited to share it with
              fellow students facing the same challenge.
            </p>

            <motion.div
              className="flex flex-wrap justify-center gap-4"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.a
                href="#"
                variants={subtleHover}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3 bg-gradient-to-r from-[#0077B5] to-[#005885] hover:from-[#005885] hover:to-[#0077B5] px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Linkedin className="w-5 h-5" />
                <span className="font-light">Connect on LinkedIn</span>
              </motion.a>

              <motion.a
                href="#"
                variants={subtleHover}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Github className="w-5 h-5" />
                <span className="font-light">View on GitHub</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Call to Action Footer */}
      <section className="relative z-10 container mx-auto px-6 py-24 max-w-7xl">
        <motion.div
          className="text-center space-y-8 bg-gradient-to-br from-[#3EB489]/20 to-[#2ea374]/10 backdrop-blur-xl rounded-3xl p-16 border border-[#3EB489]/20 shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-medium mb-6">
              Ready to Transform Your{" "}
              <span className="bg-gradient-to-r from-[#3EB489] to-[#2ea374] bg-clip-text text-transparent bitcount-grid-single-hero">
                Routine?
              </span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Join thousands of students who've already revolutionized their
              study-fitness balance
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.div
              variants={subtleHover}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#3EB489] to-[#2ea374] hover:from-[#2ea374] hover:to-[#3EB489] text-white px-12 py-6 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Start Your Free Trial
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </motion.div>

            <motion.a
              href="mailto:animish@example.com"
              className="flex items-center space-x-3 text-gray-300 hover:text-[#3EB489] transition-colors text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail className="w-6 h-6" />
              <span>Get in touch</span>
            </motion.a>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-white/10 max-w-7xl">
        <div className="text-center">
          <motion.p
            className="text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            © 2025 FitFocus. Built with ❤️ by&nbsp;
            <a
              href="https://www.animishchopade.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3EB489]"
            >
              Animish Chopade
            </a>
          </motion.p>
        </div>
        <div>
          <div className="flex justify-center space-x-8 py-4">
            {/* GitHub */}
            <motion.a
              href="https://github.com/Animish2002"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-[#3EB489] transition-colors text-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="w-6 h-6" />
            </motion.a>

            <motion.a
              href="https://www.animishchopade.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-[#3EB489] transition-colors text-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Globe className="w-6 h-6" />
            </motion.a>
            {/* LinkedIn */}
            <motion.a
              href="https://www.linkedin.com/in/animish-chopade"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-[#3EB489] transition-colors text-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Linkedin className="w-6 h-6" />
            </motion.a>

            {/* Email */}
            <motion.a
              href="mailto:animishchopade123@gmail.com"
              className="text-gray-300 hover:text-[#3EB489] transition-colors text-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail className="w-6 h-6" />
            </motion.a>
          </div>
        </div>
      </footer>
    </div>
  );
}

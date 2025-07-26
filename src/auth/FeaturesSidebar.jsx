// src/components/auth/FeaturesSidebar.jsx
import React from "react";
import { motion } from "framer-motion";
import FeatureIconSVG from "./FeatureIconSVG"; // Adjust path as needed

const FeaturesSidebar = () => {
  return (
    <motion.div
      className="hidden lg:flex flex-col justify-center space-y-12 max-w-lg"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <div className="space-y-6">
        <motion.h2
          className="text-4xl font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Transform Your{" "}
          <span className="bg-gradient-to-r from-[#3EB489] to-[#2ea374] bg-clip-text text-transparent bitcount-grid-single-hero">
            Daily Routine
          </span>
        </motion.h2>
        <motion.p
          className="text-xl text-gray-300 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Join thousands of students who've revolutionized their study-fitness
          balance with AI-powered planning.
        </motion.p>
      </div>

      <div className="space-y-8">
        {[
          {
            icon: "ai",
            title: "AI-Powered Scheduling",
            description:
              "Intelligent planning that adapts to your energy levels and preferences.",
          },
          {
            icon: "security",
            title: "Secure & Private",
            description: "Your data is encrypted and never shared.",
          },
          {
            icon: "growth",
            title: "Track Your Progress",
            description:
              "Detailed analytics to monitor your fitness and study improvements.",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            className="flex items-start space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
          >
            <div className="flex-shrink-0 w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
              <FeatureIconSVG type={feature.icon} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FeaturesSidebar;
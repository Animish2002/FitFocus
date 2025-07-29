// src/pages/NotificationSettingsPage.jsx
import React from 'react';
import { NotificationSettings } from '@/components/NotificationSettings'; // Adjust path if needed
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function NotificationSettingsPage() {
  return (
    <motion.div
      className="space-y-8"
      variants={staggerChildren}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={fadeInUp}>
        <h1 className="text-3xl font-bold text-white">App Settings</h1>
        <p className="text-gray-400 mt-2">
          Manage your application preferences.
        </p>
      </motion.div>

      <motion.div variants={fadeInUp}>
        {/* Render your NotificationSettings component here */}
        <NotificationSettings />
      </motion.div>
    </motion.div>
  );
}